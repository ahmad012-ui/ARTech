import { useState, type FormEvent } from "react";
import { submitContactInquiry } from "@/lib/supabase";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[var(--hairline)] bg-black/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-white/40 placeholder:text-muted-foreground/60";

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: quietly ignore automated submissions that fill this hidden field.
    if (String(data.get("website") ?? "").trim()) {
      setState("success");
      form.reset();
      return;
    }

    setState("submitting");
    setErrorMessage("");

    const inquiry = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim() || null,
      project_type: String(data.get("project_type") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      await submitContactInquiry(inquiry);
      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMessage("We couldn't send your message. Please try again or email hello@artech.dev.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 grid max-w-2xl gap-5 text-left md:grid-cols-2">
      <div>
        <label htmlFor="inquiry-name" className="text-sm text-foreground">Name *</label>
        <input id="inquiry-name" name="name" autoComplete="name" required minLength={2} maxLength={100} className={fieldClass} placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="inquiry-email" className="text-sm text-foreground">Email *</label>
        <input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} placeholder="you@company.com" />
      </div>
      <div>
        <label htmlFor="inquiry-company" className="text-sm text-foreground">Company <span className="text-muted-foreground">(optional)</span></label>
        <input id="inquiry-company" name="company" autoComplete="organization" maxLength={160} className={fieldClass} placeholder="Company or organization" />
      </div>
      <div>
        <label htmlFor="inquiry-type" className="text-sm text-foreground">What do you need? *</label>
        <select id="inquiry-type" name="project_type" required defaultValue="" className={fieldClass}>
          <option value="" disabled>Select a service</option>
          <option>Software development</option>
          <option>Website or UI/UX design</option>
          <option>Production support</option>
          <option>Digital marketing or operations</option>
          <option>Digital product / collaboration</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="inquiry-message" className="text-sm text-foreground">Tell us a little about it *</label>
        <textarea id="inquiry-message" name="message" required minLength={10} maxLength={5000} rows={5} className={fieldClass} placeholder="What are you trying to build or solve?" />
      </div>
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="inquiry-website">Leave this field empty</label>
        <input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={state === "submitting"} className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-medium text-[#050505] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
          {state === "submitting" ? "Sending..." : state === "success" ? "Send another inquiry" : "Send inquiry"}
        </button>
        {state === "success" && <p role="status" className="mt-4 text-sm text-foreground">Thanks — your inquiry has been sent. We'll be in touch.</p>}
        {state === "error" && <p role="alert" className="mt-4 text-sm text-red-300">{errorMessage}</p>}
        <p className="mt-4 text-xs text-muted-foreground">Your details are used to respond to your inquiry and aren't displayed publicly.</p>
      </div>
    </form>
  );
}
