import { forwardRef, useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";
import { IconButton } from "../IconButton";

export interface ButtonInfoProps {
  content: ReactNode;
  title?: string;
  className?: string;
}

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9v4M10 7h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ButtonInfo = forwardRef<HTMLDivElement, ButtonInfoProps>(
  ({ content, title, className }, ref) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
      <div ref={ref || wrapperRef} className={cn("relative inline-flex", className)}>
        <div ref={wrapperRef}>
          <IconButton
            icon={<InfoIcon />}
            aria-label="More information"
            variant="ghost"
            size="small"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          />
          {open && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-hs-2 w-[256px] rounded-hs-input border border-hs-border-subtle bg-hs-fill-app shadow-hs-menu p-hs-4">
              {title && (
                <p className={cn(hsPrimitive.popoverTitle, "mb-hs-2")}>
                  {title}
                </p>
              )}
              <div className={cn(hsPrimitive.popoverBody, "font-normal")}>
                {content}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ButtonInfo.displayName = "ButtonInfo";

export { ButtonInfo };
