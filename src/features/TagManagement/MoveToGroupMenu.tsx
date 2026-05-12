import { useEffect, useId, useMemo, useRef, useState } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { cn } from "../../lib/cn";
import { hsPrimitive } from "../../lib/hs-primitive-classes";

export type MoveToGroupMenuAlign = "start" | "end";

export function MoveToGroupMenu({
  availableGroups,
  onSelect,
  onClose,
  align = "end",
}: {
  availableGroups: Array<{ id: string; name: string }>;
  onSelect: (groupId: string) => void;
  onClose: () => void;
  /** `start` = anchor left (bulk toolbar); `end` = anchor right (row kebab) */
  align?: MoveToGroupMenuAlign;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableGroups;
    const matches = availableGroups.filter((g) =>
      g.name.toLowerCase().includes(q)
    );
    return [...matches].sort((a, b) => a.name.localeCompare(b.name));
  }, [availableGroups, query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const position =
    align === "start"
      ? { left: 0 as const, right: "auto" as const }
      : { right: 0 as const, left: "auto" as const };

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="Choose a group"
      style={{
        position: "absolute",
        ...position,
        top: "100%",
        marginTop: 4,
        zIndex: 2000,
        width: "min(100vw - 32px, 320px)",
        maxWidth: 320,
        borderRadius: 8,
        background: "var(--hs-color-fill-base)",
        boxShadow: "var(--hs-comp-menu-shadow)",
        fontFamily: HS_FONT_FAMILY,
        padding: "8px 0 0",
        display: "flex",
        flexDirection: "column",
        maxHeight: "min(360px, calc(100vh - 120px))",
      }}
    >
      <div
        style={{
          padding: "0 12px 8px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--hs-color-text-subtle)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 8,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          Move to group
        </div>
        <label htmlFor={searchId} className="sr-only">
          Search groups
        </label>
        <div
          className={cn(
            "flex w-full items-center rounded-hs-input border bg-hs-comp-combobox-bg transition-colors",
            "border-hs-comp-combobox-border",
            "hover:border-[var(--hs-comp-input-border-hover)]",
            "focus-within:border-[var(--hs-comp-input-border-focus)] focus-within:[box-shadow:var(--hs-focus-ring)]"
          )}
        >
          <input
            ref={inputRef}
            id={searchId}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search groups…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
              }
            }}
            className={cn(
              "w-full min-w-0 border-0 bg-transparent px-hs-3 py-[10px] outline-none",
              hsPrimitive.fieldText,
              "placeholder:text-hs-comp-input-placeholder",
              "[&::-webkit-search-cancel-button]:hidden"
            )}
            style={{ fontFamily: HS_FONT_FAMILY }}
          />
        </div>
      </div>

      <div
        style={{
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
          paddingBottom: 8,
        }}
      >
        {availableGroups.length === 0 && (
          <div
            style={{
              padding: "12px 16px",
              fontSize: 14,
              color: "var(--hs-color-text-disabled)",
            }}
          >
            No groups available
          </div>
        )}
        {availableGroups.length > 0 && filtered.length === 0 && (
          <div
            style={{
              padding: "12px 16px",
              fontSize: 14,
              color: "var(--hs-color-text-disabled)",
            }}
          >
            No groups match “{query.trim()}”
          </div>
        )}
        {filtered.map((g) => (
          <MoveToGroupRow
            key={g.id}
            label={g.name}
            onClick={() => onSelect(g.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MoveToGroupRow({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      role="option"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
        padding: "0 16px",
        minHeight: 48,
        fontSize: 16,
        fontWeight: 400,
        color: "var(--hs-color-text-base)",
        background: hovered ? "var(--hs-comp-badge-neutral-bg)" : "transparent",
        border: "none",
        cursor: "pointer",
        fontFamily: HS_FONT_FAMILY,
        transition: "background var(--hs-motion-duration-fast) var(--hs-motion-easing-standard)",
      }}
    >
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}
