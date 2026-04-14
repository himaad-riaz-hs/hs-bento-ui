import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const mediaVariants = cva(
  "overflow-hidden bg-[var(--hs-color-fill-base)]",
  {
    variants: {
      ratio: {
        "1:1": "aspect-square",
        "16:9": "aspect-video",
        "4:3": "aspect-[4/3]",
        auto: "",
      },
      rounded: {
        none: "",
        small: "rounded-[var(--hs-radii-2)]",
        medium: "rounded-[var(--hs-radii-3)]",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      ratio: "auto",
      rounded: "small",
    },
  }
);

export interface MediaProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mediaVariants> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
}

const Media = forwardRef<HTMLDivElement, MediaProps>(
  ({ className, ratio, rounded, src, alt, fallback, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(mediaVariants({ ratio, rounded }), className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ""}
            className="h-full w-full object-cover"
          />
        ) : fallback ? (
          <div className="flex h-full w-full items-center justify-center text-[color:var(--hs-color-icon-subtle)]">
            {fallback}
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
Media.displayName = "Media";

export { Media, mediaVariants };
