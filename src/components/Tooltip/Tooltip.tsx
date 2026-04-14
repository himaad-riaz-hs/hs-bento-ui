import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
} from "react";
import { cn } from "../../lib/cn";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: ReactNode;
  children: ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = "bottom", delay = 200, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const show = () => {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    };

    const hide = () => {
      clearTimeout(timeoutRef.current);
      setVisible(false);
    };

    useEffect(() => {
      return () => clearTimeout(timeoutRef.current);
    }, []);

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-[8px]",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-[8px]",
      left: "right-full top-1/2 -translate-y-1/2 mr-[8px]",
      right: "left-full top-1/2 -translate-y-1/2 ml-[8px]",
    };

    return (
      <div
        ref={ref}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        {children}
        {visible && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50 px-[12px] py-[8px] rounded-[var(--hs-radii-2)]",
              "bg-[var(--hs-comp-tooltip-bg)] text-hs-text-inverse",
              "font-[family-name:var(--hs-typeface-base-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)]",
              "text-hs-base-small",
              "shadow-[var(--hs-comp-menu-shadow)]",
              "whitespace-nowrap pointer-events-none",
              "animate-[fadeIn_150ms_ease-out]",
              positionClasses[position],
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
