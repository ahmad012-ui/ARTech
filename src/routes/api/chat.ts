import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { SYSTEM_PROMPT } from "@/lib/chat-content";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;

type ChatMessage = { role: "user" | "assistant"; content: string };
type Body = { messages?: ChatMessage[] };

const requestCounts = new Map<string, { count: number; resetAt: number }>();

async function readLimitedBody(request: Request): Promise<string> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new Response("Request body is too large", { status: 413 });
  }

  if (!request.body) throw new Response("Request body is required", { status: 400 });

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Response("Request body is too large", { status: 413 });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function checkRateLimit(request: Request): Response | null {
  // Vercel supplies x-real-ip. x-forwarded-for is a fallback for other trusted proxies.
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  // Without a proxy-provided client IP, don't rate-limit every visitor as one shared user.
  if (!ip) return null;

  const now = Date.now();
  for (const [key, entry] of requestCounts) {
    if (entry.resetAt <= now) requestCounts.delete(key);
  }

  const current = requestCounts.get(ip);
  if (!current || current.resetAt <= now) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }

  if (current.count >= RATE_LIMIT) {
    return new Response("Too many requests. Please try again shortly.", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)) },
    });
  }

  current.count += 1;
  return null;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rateLimitResponse = checkRateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;

        let body: Body;
        try {
          const rawBody = await readLimitedBody(request);
          body = JSON.parse(rawBody) as Body;
        } catch (error) {
          if (error instanceof Response) return error;
          return new Response("Invalid request body", { status: 400 });
        }

        if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        if (body.messages.length > MAX_MESSAGES) {
          return new Response("Too many messages", { status: 400 });
        }

        const messages: ChatMessage[] = [];
        for (const message of body.messages) {
          if (
            !message ||
            (message.role !== "user" && message.role !== "assistant") ||
            typeof message.content !== "string" ||
            message.content.trim().length === 0 ||
            message.content.length > MAX_CONTENT_LENGTH
          ) {
            return new Response("Invalid message format", { status: 400 });
          }
          messages.push({ role: message.role, content: message.content.trim() });
        }

        if (messages[messages.length - 1]?.role !== "user") {
          return new Response("The last message must be from the user", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 503 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3.8-flash"),
            instructions: SYSTEM_PROMPT,
            messages: messages as ModelMessage[],
          });

          return result.toTextStreamResponse({
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        } catch (error) {
          console.error("chat error", error);
          const status =
            typeof error === "object" && error && "statusCode" in error
              ? Number((error as { statusCode: unknown }).statusCode) || 500
              : 500;
          return new Response("The assistant is unavailable right now.", { status });
        }
      },
    },
  },
});
