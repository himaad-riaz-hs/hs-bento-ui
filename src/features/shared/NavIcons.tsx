import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

const ASSET = "https://www.figma.com/api/mcp/asset/";

export const NAV_ASSETS = {
  owlPart1: `${ASSET}0b9ebf83-0907-48b6-85c0-619c3b60406e`,
  owlPart2: `${ASSET}ef6b2dbe-9ee7-49a1-8434-6e4bd96a1379`,
  owlPart3: `${ASSET}b6b8f343-5ca6-4952-8430-7f31919e46c6`,
  home: `${ASSET}37872d0f-43e4-4971-a079-4e7993209f15`,
  plan: `${ASSET}0541117f-699f-4e58-9b0c-1c3c0208d61a`,
  create: `${ASSET}344d65db-ee8e-4741-9bdd-55efa98208e2`,
  monitor: `${ASSET}7055a762-8d21-4094-a460-fb91ab81df07`,
  reply: `${ASSET}7de4ce46-36dd-4c92-a5aa-6d32ce0db781`,
  analyze: `${ASSET}16ba72ce-8aa6-4342-8c0f-75cc0e87d5a1`,
  more: `${ASSET}7729cfff-182e-4774-94c6-f674197d51b7`,
  help: `${ASSET}55432933-239c-4de8-bbae-4af887edf422`,
  avatar: `${ASSET}d2612090-5161-4d7b-a978-b280518b339a`,
};

const ICON_INSETS: Record<string, string> = {
  home: "14.58% 8.33%",
  plan: "8.33% 12.5%",
  create: "8.33%",
  monitor: "18.75% 4.17%",
  reply: "18.75% 12.5%",
  analyze: "16.67%",
  more: "41.67% 16.67%",
  help: "8.33%",
};

interface NavIconProps {
  name: keyof typeof ICON_INSETS;
  filled?: boolean;
}

export function NavIcon({ name, filled }: NavIconProps) {
  /* Remote Figma MCP URLs for `create` often expire or fail — use a local glyph so Create always shows. */
  if (name === "create") {
    return (
      <div
        style={{
          position: "relative",
          width: 24,
          height: 24,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "inherit",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M12 8v8M8 12h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  const src = NAV_ASSETS[name as keyof typeof NAV_ASSETS];
  const inset = ICON_INSETS[name] || "8.33%";
  return (
    <div style={{ position: "relative", width: 24, height: 24, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset, display: "flex" }}>
        <img
          alt=""
          src={src}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            filter: filled ? "brightness(0) invert(1)" : undefined,
          }}
        />
      </div>
    </div>
  );
}

export function OwlLogo() {
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: "0 0.46% 0.35% 0" }}>
        <img alt="" src={NAV_ASSETS.owlPart1} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }} />
      </div>
      <div style={{ position: "absolute", inset: "28.29% 10.43% 20.44% 14.51%" }}>
        <img alt="" src={NAV_ASSETS.owlPart2} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }} />
      </div>
      <div style={{ position: "absolute", inset: "43.57% 22.46% 43.87% 36.39%" }}>
        <img alt="" src={NAV_ASSETS.owlPart3} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }} />
      </div>
    </div>
  );
}

export function AvatarImage({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", flexShrink: 0, position: "relative" }}>
      <img alt="User" src={NAV_ASSETS.avatar} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

const NAV_ITEMS_TOP = [
  { label: "Home", icon: "home" as const, active: false },
  { label: "Plan", icon: "plan" as const, active: false },
  { label: "Create", icon: "create" as const, active: true },
  { label: "Monitor", icon: "monitor" as const, active: false },
  { label: "Reply", icon: "reply" as const, active: false },
  { label: "Analyze", icon: "analyze" as const, active: false },
];

const NAV_ITEMS_BOTTOM = [
  { label: "More", icon: "more" as const },
  { label: "Help", icon: "help" as const },
];

interface ProductNavProps {
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

export function ProductNav({ activeItem = "Create", onItemClick }: ProductNavProps) {
  return (
    <aside
      style={{
        width: 80,
        background: "var(--hs-color-fill-app)",
        borderRight: "1px solid var(--hs-color-border-subtle)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        height: "100%",
      }}
    >
      {/* Top: logo + nav items */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ padding: "8px 12px" }}>
          <OwlLogo />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80 }}>
          {NAV_ITEMS_TOP.map((item) => {
            const isActive = item.label === activeItem;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onItemClick?.(item.label)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 8,
                  width: "100%",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: HS_FONT_FAMILY,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive ? "var(--hs-comp-button-filled-bg)" : "transparent",
                    color: isActive ? "var(--hs-comp-button-filled-text)" : "var(--hs-color-text-base)",
                    overflow: "hidden",
                  }}
                >
                  <NavIcon name={item.icon} filled={isActive} />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: "24px",
                    color: "var(--hs-color-text-base)",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: More, Help, Avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 72 }}>
        {NAV_ITEMS_BOTTOM.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onItemClick?.(item.label)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 8,
              width: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: HS_FONT_FAMILY,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                color: "var(--hs-color-text-base)",
                overflow: "hidden",
              }}
            >
              <NavIcon name={item.icon} />
            </div>
            <span style={{ fontSize: 14, lineHeight: "24px", color: "var(--hs-color-text-base)", textAlign: "center" }}>
              {item.label}
            </span>
          </button>
        ))}
        <div style={{ padding: "8px 12px" }}>
          <AvatarImage size={48} />
        </div>
      </div>
    </aside>
  );
}
