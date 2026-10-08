import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { SoftwareSolutions } from "@/components/site/SoftwareSolutions";
// import { Work } from "@/components/site/Work"; // Temporarily hidden until ARTech Labs has real projects to showcase.
import { About } from "@/components/site/About";
import { Technology } from "@/components/site/Technology";
import { EngineeringPrinciples } from "@/components/site/EngineeringPrinciples";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";
import { ChatbotProvider } from "@/components/chat/ChatbotContext";
import { Chatbot } from "@/components/chat/Chatbot";

const TITLE = "ARTech Labs — Software Solutions & Digital Products";
const DESCRIPTION =
  "ARTech Labs builds digital experiences, software solutions, and digital products — engineering, design, and product thinking for modern businesses.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ChatbotProvider>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <SoftwareSolutions />
        {/* <Work /> Temporarily disabled until we have real projects to showcase. */}
        <About />
        <Technology />
        <EngineeringPrinciples />
        <CTA />
      </main>
      <Footer />
      <Chatbot />
    </ChatbotProvider>
  );
}
