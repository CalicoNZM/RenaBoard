"use client";

import { useEffect, useRef } from "react";

export function FlowingLiquidBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let time = 0;
    
    // Abstract flowing liquid effect
    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Create a gradient that slowly shifts
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsl(${(time * 50) % 360}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${((time * 50) + 60) % 360}, 80%, 40%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add overlapping animated waves for "flowing liquid"
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 20) {
          const y = Math.sin(x * 0.005 + time * (i + 1)) * 100 + 
                    Math.cos(x * 0.002 - time) * 50 + 
                    height * 0.5 + (i * 100);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.fill();
      }
      
      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none"
      }}
    />
  );
}
