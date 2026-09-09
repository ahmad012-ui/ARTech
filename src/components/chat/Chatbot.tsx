import { lazy, Suspense, useEffect, useState } from "react";
import { ChatbotLauncher } from "./ChatbotLauncher";
import { useChatbot } from "./ChatbotContext";

const ChatbotPanel = lazy(() =>
  import("./ChatbotPanel").then((m) => ({ default: m.ChatbotPanel })),
);

export function Chatbot() {
  const { isOpen } = useChatbot();
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setEverOpened(true);
  }, [isOpen]);

  return (
    <>
      <ChatbotLauncher />
      {everOpened && (
        <Suspense fallback={null}>
          <ChatbotPanel />
        </Suspense>
      )}
    </>
  );
}
