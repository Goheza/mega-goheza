import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/goheza-logo.png";

export function Logo({
  className = "",
  height = 28,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Link to="/" aria-label="Goheza home" className={`inline-flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Goheza"
        height={height}
        style={{ height: `${height}px`, width: "auto" }}
        className="block select-none"
        draggable={false}
      />
    </Link>
  );
}
