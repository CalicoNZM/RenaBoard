"use client";

import { useEffect, useState } from "react";

export function WritingNotesAnimation({ text = "Thinking..." }: { text?: string }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      gap: "1rem"
    }}>
      {/* Silly writing notes logo using CSS and an SVG */}
      <div style={{
        position: "relative",
        width: "60px",
        height: "60px",
        animation: "bounce 1s infinite alternate"
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             style={{ width: "100%", height: "100%", color: "var(--primary-color)" }}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <div style={{
          position: "absolute",
          bottom: "-10px",
          right: "-10px",
          width: "20px",
          height: "20px",
          backgroundColor: "var(--accent-color)",
          borderRadius: "50%",
          animation: "pulse 1s infinite"
        }} />
      </div>
      
      <p style={{
        fontFamily: "var(--font-family)",
        fontWeight: "bold",
        fontSize: "1.2rem",
        color: "var(--text-color)"
      }}>
        {text}{dots}
      </p>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0) rotate(-5deg); }
          to { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
