"use client";

import { useEffect, useRef } from "react";

const BUBBLE_COLORS = ["#B54643", "#47C6FC", "#054662"];
const BACKGROUND_GRADIENT = ["#051543", "#051543"];
const BUBBLE_COUNT_FACTOR = 0.01;
const VELOCITY_FACTOR = 0.7;

interface Bubble {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  opacity: number;
  color: string;
}

const BubbleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const bubbleCount = Math.floor((width + height) * BUBBLE_COUNT_FACTOR);
    const bubbles: Bubble[] = [];

    const getRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const getRandomColor = () =>
      BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x:
          Math.random() > 0.35
            ? getRandom(width * 0.6, width)
            : getRandom(0, width * 0.4),
        y:
          Math.random() > 0.15
            ? getRandom(0, height * 0.5)
            : getRandom(0, height),
        radius: getRandom(width / 200, width / 100),
        angle: getRandom(0, Math.PI * 2),
        velocity: getRandom(0, VELOCITY_FACTOR),
        opacity: getRandom(0.1, 1),
        color: getRandomColor(),
      });
    }

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, BACKGROUND_GRADIENT[0]);
    gradient.addColorStop(1, BACKGROUND_GRADIENT[1]);

    const animate = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";

      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.opacity;
        ctx.fill();

        // Move
        b.x += Math.cos(b.angle) * b.velocity;
        b.y += Math.sin(b.angle) * b.velocity;

        // Wrap
        if (b.x - b.radius > width) b.x = -b.radius;
        if (b.x + b.radius < 0) b.x = width + b.radius;
        if (b.y - b.radius > height) b.y = -b.radius;
        if (b.y + b.radius < 0) b.y = height + b.radius;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default BubbleCanvas;
