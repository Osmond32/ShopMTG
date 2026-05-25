// src/Components/MagicCursor.jsx
import React, { useState, useEffect, useRef } from "react";

export default function MagicCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState([]);
  const lastPositionRef = useRef({ x: -100, y: -100 });
  const sparkIdRef = useRef(0);

  useEffect(() => {
    // Only enable on devices that have a fine pointer (e.g., mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });

      // Generate sparks when moving
      const dx = x - lastPositionRef.current.x;
      const dy = y - lastPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const id = sparkIdRef.current++;
        // Random drift direction for sparkling particles
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 25 + 5;
        const targetX = Math.cos(angle) * speed;
        const targetY = Math.sin(angle) * speed - (Math.random() * 15); // drift slightly up

        const newSpark = {
          id,
          x,
          y,
          targetX: `${targetX}px`,
          targetY: `${targetY}px`,
          size: Math.random() * 5 + 2, // tiny sparkling dots
        };

        setSparks((prev) => [...prev.slice(-30), newSpark]);

        // Remove after animation (600ms)
        setTimeout(() => {
          setSparks((prev) => prev.filter((s) => s.id !== id));
        }, 600);

        lastPositionRef.current = { x, y };
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer") ||
        target.tagName === "INPUT";
      
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // "Always alive" sparkling generator (both when stationary and moving)
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Spawn small sparks at the current mouse position continuously
      if (position.x > 0 && position.y > 0) {
        const id = sparkIdRef.current++;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 20 + 5;
        const targetX = Math.cos(angle) * speed;
        const targetY = Math.sin(angle) * speed - 10;

        const newSpark = {
          id,
          x: position.x,
          y: position.y,
          targetX: `${targetX}px`,
          targetY: `${targetY}px`,
          size: Math.random() * 5 + 2,
        };

        setSparks((prev) => [...prev.slice(-30), newSpark]);

        setTimeout(() => {
          setSparks((prev) => prev.filter((s) => s.id !== id));
        }, 600);
      }
    }, 100); // quick rate for a lively sparkling effect

    return () => clearInterval(interval);
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Sparks emitted by the point (pure round glowing dots that drift and fade) */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute magic-trail rounded-full mix-blend-screen"
          style={{
            left: s.x,
            top: s.y,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: isHovered ? "#22d3ee" : "#f59e0b",
            boxShadow: `0 0 ${s.size * 2.5}px ${isHovered ? "#22d3ee" : "#f59e0b"}`,
            "--x": s.targetX,
            "--y": s.targetY,
          }}
        />
      ))}

      {/* Main Glowing Point (Exactly the size of a mouse cursor arrow: 20px) */}
      <div
        className={`absolute rounded-full transition-colors duration-300 mix-blend-screen ${
          isHovered ? "magic-point-hover bg-cyan-100" : "magic-point-core bg-amber-50"
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: "20px",
          height: "20px",
          border: "2px solid rgba(255, 255, 255, 0.95)",
        }}
      />
    </div>
  );
}
