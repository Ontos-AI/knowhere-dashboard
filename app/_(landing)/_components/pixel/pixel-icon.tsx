"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type IconType =
  | "check"
  | "cross"
  | "minus"
  | "arrow-right"
  | "arrow-down"
  | "arrow-up"
  | "star"
  | "badge"
  | "github"
  | "discord"
  | "docs"
  | "api"
  | "database"
  | "performance"
  | "security"
  | "cloud"
  | "users"
  | "message"
  | "twitter"
  | "sparkles"
  | "shield"
  | "zap"
  | "atom"
  | "code"
  | "globe"
  | "grid"
  | "book"
  | "linkedin"
  | "external-link"
  | "file"
  | "gauge"
  | "chart"
  | "clock"
  | "layers"
  | "weight";

type PixelIconProps = {
  icon: IconType;
  size?: 16 | 20 | 24 | 32;
  color?: "default" | "green" | "yellow" | "red";
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const PixelIcon = ({
  icon,
  size = 16,
  color = "default",
  className,
  ...props
}: PixelIconProps) => {
  // Generate accessible label for icons
  const getAriaLabel = (iconType: IconType): string => {
    const labels: Record<IconType, string> = {
      check: "Check mark",
      cross: "Cross mark",
      minus: "Minus sign",
      "arrow-right": "Arrow pointing right",
      "arrow-down": "Arrow pointing down",
      "arrow-up": "Arrow pointing up",
      star: "Star",
      badge: "Badge",
      github: "GitHub",
      discord: "Discord",
      docs: "Documentation",
      api: "API",
      database: "Database",
      performance: "Performance",
      security: "Security",
      cloud: "Cloud",
      users: "Users",
      message: "Message",
      twitter: "Twitter/X",
      sparkles: "Sparkles",
      shield: "Shield",
      zap: "Lightning",
      atom: "Atom",
      code: "Code",
      globe: "Globe",
      grid: "Grid",
      book: "Book",
      linkedin: "LinkedIn",
      "external-link": "External link",
      file: "File",
      gauge: "Gauge",
      chart: "Chart",
      clock: "Clock",
      layers: "Layers",
      weight: "Weight",
    };
    return labels[iconType];
  };

  const ariaLabel = getAriaLabel(icon);

  const renderIcon = () => {
    switch (icon) {
      case "check":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        );
      case "cross":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "minus":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        );
      case "arrow-right":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M2 8H14M14 8L10 4M14 8L10 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "arrow-down":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M8 2V14M8 14L4 10M8 14L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "arrow-up":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M8 14V2M8 2L4 6M8 2L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "star":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="7" y="0" width="2" height="4" />
            <rect x="7" y="12" width="2" height="4" />
            <rect x="0" y="7" width="4" height="2" />
            <rect x="12" y="7" width="4" height="2" />
            <rect x="3" y="3" width="2" height="2" />
            <rect x="11" y="3" width="2" height="2" />
            <rect x="3" y="11" width="2" height="2" />
            <rect x="11" y="11" width="2" height="2" />
          </svg>
        );
      case "badge":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2" />
            <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        );
      case "github":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="4" y="2" width="8" height="2" />
            <rect x="2" y="4" width="2" height="8" />
            <rect x="12" y="4" width="2" height="8" />
            <rect x="4" y="12" width="2" height="2" />
            <rect x="10" y="12" width="2" height="2" />
            <rect x="6" y="6" width="2" height="2" />
            <rect x="8" y="6" width="2" height="2" />
          </svg>
        );
      case "discord":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="4" width="12" height="8" />
            <rect x="4" y="2" width="8" height="2" />
            <rect x="5" y="7" width="2" height="2" fill="white" />
            <rect x="9" y="7" width="2" height="2" fill="white" />
          </svg>
        );
      case "docs":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="4" y="2" width="8" height="12" />
            <rect x="6" y="5" width="4" height="1" fill="white" />
            <rect x="6" y="7" width="4" height="1" fill="white" />
            <rect x="6" y="9" width="4" height="1" fill="white" />
          </svg>
        );
      case "api":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M2 4L8 8L2 12M14 4L8 8L14 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "database":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="4" y="2" width="8" height="3" />
            <rect x="4" y="6" width="8" height="3" />
            <rect x="4" y="10" width="8" height="3" />
          </svg>
        );
      case "performance":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="7" y="2" width="2" height="6" />
            <rect x="5" y="8" width="2" height="2" />
            <rect x="9" y="8" width="2" height="2" />
            <rect x="3" y="10" width="2" height="2" />
            <rect x="11" y="10" width="2" height="2" />
            <rect x="1" y="12" width="2" height="2" />
            <rect x="13" y="12" width="2" height="2" />
          </svg>
        );
      case "security":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="6" y="2" width="4" height="2" />
            <rect x="4" y="4" width="8" height="10" />
            <rect x="7" y="7" width="2" height="3" fill="white" />
            <rect x="7" y="11" width="2" height="1" fill="white" />
          </svg>
        );
      case "cloud":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="4" y="6" width="8" height="4" />
            <rect x="2" y="8" width="2" height="2" />
            <rect x="12" y="8" width="2" height="2" />
            <rect x="6" y="4" width="4" height="2" />
          </svg>
        );
      case "users":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="2" width="4" height="4" />
            <rect x="10" y="2" width="4" height="4" />
            <rect x="1" y="8" width="6" height="6" />
            <rect x="9" y="8" width="6" height="6" />
          </svg>
        );
      case "message":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="3" width="12" height="8" />
            <rect x="4" y="11" width="2" height="2" />
            <rect x="5" y="6" width="6" height="1" fill="white" />
            <rect x="5" y="8" width="4" height="1" fill="white" />
          </svg>
        );
      case "twitter":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            {/* X logo - pixel art style */}
            <rect x="2" y="2" width="2" height="2" />
            <rect x="4" y="4" width="2" height="2" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="10" y="4" width="2" height="2" />
            <rect x="12" y="2" width="2" height="2" />
            <rect x="2" y="12" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="10" y="10" width="2" height="2" />
            <rect x="12" y="12" width="2" height="2" />
          </svg>
        );
      case "sparkles":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="7" y="2" width="2" height="2" />
            <rect x="2" y="7" width="2" height="2" />
            <rect x="12" y="7" width="2" height="2" />
            <rect x="7" y="12" width="2" height="2" />
            <rect x="4" y="4" width="2" height="2" />
            <rect x="10" y="4" width="2" height="2" />
            <rect x="4" y="10" width="2" height="2" />
            <rect x="10" y="10" width="2" height="2" />
          </svg>
        );
      case "shield":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="6" y="2" width="4" height="2" />
            <rect x="4" y="4" width="8" height="10" />
            <rect x="7" y="7" width="2" height="3" fill="white" />
            <rect x="7" y="11" width="2" height="1" fill="white" />
          </svg>
        );
      case "zap":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="9" y="2" width="2" height="2" />
            <rect x="7" y="4" width="2" height="2" />
            <rect x="5" y="6" width="6" height="2" />
            <rect x="7" y="8" width="2" height="2" />
            <rect x="5" y="10" width="2" height="2" />
            <rect x="3" y="12" width="2" height="2" />
          </svg>
        );
      case "atom":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <circle cx="8" cy="8" r="2" fill="currentColor" />
            <ellipse
              cx="8"
              cy="8"
              rx="6"
              ry="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <ellipse
              cx="8"
              cy="8"
              rx="6"
              ry="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              transform="rotate(60 8 8)"
            />
            <ellipse
              cx="8"
              cy="8"
              rx="6"
              ry="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              transform="rotate(120 8 8)"
            />
          </svg>
        );
      case "code":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <path
              d="M5 4L2 8L5 12M11 4L14 8L11 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        );
      case "globe":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="M8 2C8 2 6 5 6 8C6 11 8 14 8 14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 2C8 2 10 5 10 8C10 11 8 14 8 14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case "grid":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="2" width="5" height="5" />
            <rect x="9" y="2" width="5" height="5" />
            <rect x="2" y="9" width="5" height="5" />
            <rect x="9" y="9" width="5" height="5" />
          </svg>
        );
      case "book":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="3" y="2" width="10" height="12" />
            <rect x="3" y="2" width="2" height="12" fill="white" opacity="0.3" />
            <rect x="6" y="5" width="5" height="1" fill="white" />
            <rect x="6" y="7" width="5" height="1" fill="white" />
            <rect x="6" y="9" width="5" height="1" fill="white" />
          </svg>
        );
      case "linkedin":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="6" width="3" height="8" />
            <rect x="6" y="6" width="3" height="8" />
            <rect x="9" y="8" width="5" height="6" />
            <rect x="2" y="2" width="3" height="3" />
          </svg>
        );
      case "external-link":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            {/* Box */}
            <rect x="2" y="4" width="10" height="10" stroke="currentColor" strokeWidth="2" />
            {/* Arrow pointing top-right */}
            <path d="M10 2H14V6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            <path d="M14 2L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        );
      case "file":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="4" y="2" width="6" height="2" />
            <rect x="3" y="4" width="10" height="10" />
            <rect x="6" y="6" width="4" height="1" fill="white" />
            <rect x="6" y="8" width="4" height="1" fill="white" />
            <rect x="6" y="10" width="4" height="1" fill="white" />
          </svg>
        );
      case "gauge":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <circle cx="8" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
            <path d="M8 10L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            <circle cx="8" cy="10" r="1" fill="currentColor" />
          </svg>
        );
      case "chart":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            <rect x="2" y="10" width="3" height="4" />
            <rect x="6" y="6" width="3" height="8" />
            <rect x="10" y="3" width="3" height="11" />
          </svg>
        );
      case "clock":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            {/* Clock circle */}
            <rect x="3" y="2" width="10" height="2" />
            <rect x="2" y="3" width="2" height="10" />
            <rect x="12" y="3" width="2" height="10" />
            <rect x="3" y="12" width="10" height="2" />
            {/* Hour hand pointing right */}
            <rect x="8" y="7" width="3" height="2" />
            {/* Minute hand pointing up */}
            <rect x="7" y="4" width="2" height="4" />
          </svg>
        );
      case "layers":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            {/* Two parallel squares representing concurrent execution */}
            {/* Left square */}
            <rect x="2" y="3" width="5" height="5" />
            <rect x="3" y="4" width="3" height="3" fill="white" opacity="0.3" />
            {/* Right square */}
            <rect x="9" y="3" width="5" height="5" />
            <rect x="10" y="4" width="3" height="3" fill="white" opacity="0.3" />
            {/* Connection line at bottom indicating parallel */}
            <rect x="4" y="10" width="2" height="3" />
            <rect x="10" y="10" width="2" height="3" />
            <rect x="6" y="12" width="4" height="1" />
          </svg>
        );
      case "weight":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="currentColor"
            className="pixel-image"
            role="img"
            aria-label={ariaLabel}
          >
            {/* File with size indicator */}
            {/* File shape */}
            <rect x="4" y="2" width="6" height="2" />
            <rect x="3" y="4" width="8" height="9" />
            <rect x="5" y="6" width="4" height="1" fill="white" opacity="0.4" />
            <rect x="5" y="8" width="4" height="1" fill="white" opacity="0.4" />
            {/* Size indicator - arrow pointing up */}
            <rect x="11" y="7" width="2" height="4" />
            <rect x="10" y="7" width="4" height="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        color === "green" && "text-pixel-green",
        color === "yellow" && "text-pixel-yellow",
        color === "red" && "text-pixel-red",
        className
      )}
      {...props}
    >
      {renderIcon()}
    </div>
  );
};
