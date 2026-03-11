"use client";

import { cn } from "@/lib/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  centerFadeRadius?: number;
  centerFadeSoftness?: number;
}

type GridParams = {
  cols: number;
  rows: number;
  squares: Float32Array;
  dpr: number;
};

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  centerFadeRadius = 100,
  centerFadeSoftness = 120,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridParamsRef = useRef<GridParams | null>(null);

  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    const toRGBA = (inputColor: string) => {
      if (typeof window === "undefined") {
        return "rgba(0, 0, 0,";
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;

      const ctx = canvas.getContext("2d");
      if (!ctx) return "rgba(0, 0, 0,";

      ctx.fillStyle = inputColor;
      ctx.fillRect(0, 0, 1, 1);

      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };

    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number): GridParams => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);

      const step = (squareSize + gridGap) * dpr;
      const squarePixelSize = squareSize * dpr;

      const centerX = width / 2;
      const centerY = height / 2;

      const innerRadius = centerFadeRadius * dpr;
      const outerRadius = (centerFadeRadius + centerFadeSoftness) * dpr;

      const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
        return t * t * (3 - 2 * t);
      };

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * step;
          const y = j * step;

          const cubeCenterX = x + squarePixelSize / 2;
          const cubeCenterY = y + squarePixelSize / 2;

          const dx = cubeCenterX - centerX;
          const dy = cubeCenterY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const radialFade =
            centerFadeSoftness <= 0
              ? distance >= innerRadius
                ? 1
                : 0
              : smoothstep(innerRadius, outerRadius, distance);

          const opacity = squares[i * rows + j] * radialFade;
          if (opacity <= 0.001) continue;

          ctx.fillStyle = `${memoizedColor}${opacity})`;
          ctx.fillRect(x, y, squarePixelSize, squarePixelSize);
        }
      }
    },
    [
      memoizedColor,
      squareSize,
      gridGap,
      centerFadeRadius,
      centerFadeSoftness,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let lastTime = 0;

    const renderCurrentGrid = () => {
      const gridParams = gridParamsRef.current;
      if (!gridParams) return;

      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
    };

    const updateCanvasSize = () => {
      const newWidth = width ?? container.clientWidth;
      const newHeight = height ?? container.clientHeight;

      setCanvasSize({ width: newWidth, height: newHeight });
      gridParamsRef.current = setupCanvas(canvas, newWidth, newHeight);
      renderCurrentGrid();
    };

    const animate = (time: number) => {
      const gridParams = gridParamsRef.current;
      if (!isInView || !gridParams) return;

      const deltaTime = lastTime === 0 ? 0 : (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);

      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(container);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};