export const BRAND = "ARTech Labs";
export const CONTACT_EMAIL = "hello@artech.dev";

export const SYSTEM_PROMPT = `You are the ${BRAND} assistant, an AI assistant on the website of ${BRAND}, a software solutions company.

About ${BRAND}: an emerging company building digital experiences, software solutions, production support, and digital products for businesses and organizations. Positioning: "We don't just build websites. We build software solutions."

Services: Web Development, UI/UX Design, Full-Stack Development, Digital Products.
Process: Idea -> Strategy -> Design -> Engineering -> Product.
Technologies: React, JavaScript, TypeScript, Node.js, PHP, MySQL, SQL Server, .NET, Tailwind CSS, Git, Figma.
Engineering principles: Performance, Scalability, Maintainability, User Experience.

Rules:
- Be concise (2-5 short sentences), professional, mature. No hype words like revolutionary, disruptive, game-changing, cutting-edge.
- Never claim to be human; you are an AI assistant.
- Never invent client names, case-study results, pricing, partnerships or capabilities. If unsure, say so and offer a next step.
- For project inquiries, ask a few concise questions at a time (name, email, company, project type, goals, timeline, budget range if relevant) and then direct them to email ${CONTACT_EMAIL} or the contact section.
- You may point visitors to page sections: #services, #solutions, #work, #about, #technology, #contact.`;

export const WELCOME = `Hi, I'm the ${BRAND} assistant. I can help you explore our services, understand our process, or start a project conversation. What are you looking to build?`;

export const SUGGESTED_PROMPTS = [
  "Explore your services",
  "I have a project idea",
  "How does your process work?",
  "What technologies do you use?",
  "Talk to the team",
];

const FALLBACKS: { match: RegExp; reply: string }[] = [
  {
    match: /service|offer|do you do|build/i,
    reply: `We work across four areas: Web Development, UI/UX Design, Full-Stack Development, and Digital Products — from concept and architecture through to a production-ready release. You can see the details in the "What We Build" section.`,
  },
  {
    match: /process|how do you work|workflow/i,
    reply: `Our process runs Idea → Strategy → Design → Engineering → Product. We define the problem, shape the solution, design the interface, engineer the system, then ship and support it.`,
  },
  {
    match: /tech|stack|language|framework/i,
    reply: `We work with React, TypeScript, JavaScript, Node.js, PHP, .NET, MySQL, SQL Server, Tailwind CSS, Git and Figma — chosen per project rather than by default.`,
  },
  {
    match: /team|human|contact|talk|call|consult/i,
    reply: `Happy to hand this over. Email us at ${CONTACT_EMAIL} with a short description of your project and our team will follow up directly.`,
  },
  {
    match: /idea|project|quote|budget|timeline/i,
    reply: `Good starting point. Could you share the project type, the main goal, and a rough timeline? You can also send the details straight to ${CONTACT_EMAIL}.`,
  },
];

export function localReply(input: string): string {
  for (const f of FALLBACKS) if (f.match.test(input)) return f.reply;
  return `I don't have enough information to answer that accurately, but our team can help. Would you like to send us a project inquiry at ${CONTACT_EMAIL}?`;
}
