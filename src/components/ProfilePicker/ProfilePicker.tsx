import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface Profile {
  id: string;
  name: string;
  avatarUrl?: string;
  initials?: string;
}

export interface ProfilePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  profiles: Profile[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  maxVisible?: number;
  onAdd?: () => void;
  onManage?: () => void;
}

function Avatar({ profile, size = 32 }: { profile: Profile; size?: number }) {
  return (
    <span
      title={profile.name}
      className="inline-flex items-center justify-center rounded-full bg-[var(--hs-color-fill-base)] border-[2px] border-[var(--hs-color-border-subtle)] overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {profile.avatarUrl ? (
        <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-[family-name:var(--hs-typeface-base-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] text-[10px] font-semibold text-[color:var(--hs-color-text-subtle)]">
          {profile.initials || profile.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}

const ProfilePicker = forwardRef<HTMLDivElement, ProfilePickerProps>(
  ({ profiles, selected = [], onChange, maxVisible = 4, onAdd, onManage, className, ...props }, ref) => {
    const selectedSet = new Set(selected);
    const visible = profiles.filter((p) => selectedSet.has(p.id)).slice(0, maxVisible);
    const overflowCount = Math.max(0, selected.length - maxVisible);

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        <button
          type="button"
          onClick={onManage}
          className={cn(
            "inline-flex items-center rounded-[50px] pr-[8px] transition-colors",
            "hover:bg-[var(--hs-color-fill-base)] focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]"
          )}
        >
          <div className="flex -space-x-2">
            {visible.map((p) => (
              <Avatar key={p.id} profile={p} />
            ))}
          </div>
          {overflowCount > 0 && (
            <span className="ml-[4px] font-[family-name:var(--hs-typeface-base-font-family,'Source_Sans_3','Source_Sans_Pro',sans-serif)] text-[14px] font-semibold text-[color:var(--hs-color-text-subtle)]">
              +{overflowCount}
            </span>
          )}
          <span className="ml-[4px] text-[color:var(--hs-color-icon-subtle)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className={cn(
              "ml-[4px] inline-flex items-center justify-center h-[32px] w-[32px]",
              "rounded-full border border-dashed border-[var(--hs-color-border-base)] text-[color:var(--hs-color-icon-subtle)]",
              "hover:bg-[var(--hs-color-fill-base)] hover:border-[var(--hs-color-border-strong)] transition-colors",
              "focus-visible:outline-none focus-visible:[box-shadow:var(--hs-focus-ring)]"
            )}
            aria-label="Add profile"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
ProfilePicker.displayName = "ProfilePicker";

export { ProfilePicker };
