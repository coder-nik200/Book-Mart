import React from "react";
import AiChatBot from "./AiChatBot";
import { useAuth } from "../../context/AuthContext";

const FloatingChatBot = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null; 

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        width: 60,
        height: 60,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
      onClick={() => {

        const chat = document.getElementById("ai-chat-window");
        if (chat)
          chat.style.display = chat.style.display === "none" ? "block" : "none";
      }}
    >
      <AiChatBot />
    </div>
  );
};

export default FloatingChatBot;
