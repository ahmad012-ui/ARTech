import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { SYSTEM_PROMPT } from "@/lib/chat-content";

type Body = { messages?: { role: "user" | "assistant"; content: string }[] };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured", { status: 503 });

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("google/gemini-3.8-flash"),
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-20).map(
                (m): ModelMessage => ({
                  role: m.role,
                  content: String(m.content ?? "").slice(0, 4000),
                }),
              ),
            ],
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
