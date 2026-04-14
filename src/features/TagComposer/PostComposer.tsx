import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { CardSurface } from "../../components/CardSurface";
import { Input } from "../../components/Input";
import { InputSearch } from "../../components/InputSearch";
import { Switch } from "../../components/Switch";
import { TagCombobox } from "./TagCombobox";
import { composerGroups, ungroupedTags } from "./sample-data";
import type { ComposerTag, ComposerTagGroup } from "./types";
import { ProductNav, AvatarImage } from "../shared/NavIcons";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

const IconXLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M3 3l5.5 7L3 17h1.5l4.5-5.5L13 17h4l-5.8-7.5L16.5 3H15l-4.2 5.2L7 3H3z" fill="currentColor"/></svg>
);
const IconInstagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="14.5" cy="5.5" r="1" fill="currentColor"/></svg>
);
const IconFacebook = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none"><path d="M18 10a8 8 0 10-9.25 7.9v-5.59H6.5V10h2.25V8.25c0-2.2 1.33-3.42 3.33-3.42.97 0 1.97.17 1.97.17V7.2h-1.1c-1.1 0-1.45.68-1.45 1.38V10H14l-.38 2.31h-2.12v5.59A8 8 0 0018 10z" fill="currentColor"/></svg>
);

const IconXTag = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 2.5l4.3 5.5L2.5 13.5h1.2l3.5-4.3L10.5 13.5h3.2l-4.5-5.8L13.5 2.5h-1.2L9 7.2 5.8 2.5H2.5z" fill="currentColor"/></svg>
);
const IconInstagramTag = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.2"/><circle cx="11.8" cy="4.2" r="0.8" fill="currentColor"/></svg>
);
const IconFacebookTag = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.4 8a6.4 6.4 0 10-7.4 6.32v-4.47H5.2V8H7v-1.4c0-1.76 1.06-2.74 2.66-2.74.78 0 1.58.14 1.58.14v1.76h-.88c-.88 0-1.16.54-1.16 1.1V8h1.92l-.3 1.85h-1.62v4.47A6.4 6.4 0 0014.4 8z" fill="currentColor"/></svg>
);

const IconAutoAwesome = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M15 12l.75 1.75L17.5 14.5l-1.75.75L15 17l-.75-1.75-1.75-.75 1.75-.75z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
);
const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 3l-1.5 14M14 3l-1.5 14M3 7.5h14.5M2.5 12.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconMood = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 12s1.5 2.5 3.5 2.5 3.5-2.5 3.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7.5" cy="8" r="1" fill="currentColor"/><circle cx="12.5" cy="8" r="1" fill="currentColor"/></svg>
);
const IconImage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 16l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconCanva = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8c-2 0-3.5 1.8-3.5 4s1.5 4 3.5 4 3-1.5 3-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconAddCircle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5.5v5M5.5 8h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
);
const IconCloseFullscreen = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 12h4v4M16 8h-4V4M4 8h4V4M16 12h-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconCloseX = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
);

const IconAdobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 16l3-8 2.5 6L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OWLY_SUGGESTIONS = [
  {
    id: "o1",
    title: "Add the best hashtags for reach",
    body: "We will analyze your caption and suggest hashtags that balance volume and relevance for Instagram search.",
  },
  {
    id: "o2",
    title: "Shorten for mobile readers",
    body: "Front-load the key message in the first two lines so it shows before “more” on small screens.",
  },
  {
    id: "o3",
    title: "Match your brand voice",
    body: "Tune tone to your saved voice profile for this account.",
  },
] as const;

type PublishPlatform = "x" | "instagram" | "facebook";

type PublishAccount = { id: string; name: string; platform: PublishPlatform };

const INITIAL_PUBLISH_ACCOUNTS: PublishAccount[] = [
  { id: "pa-1", name: "somosbank", platform: "x" },
  { id: "pa-2", name: "somostbank", platform: "instagram" },
  { id: "pa-3", name: "somosbank", platform: "facebook" },
];

const PublishPlatformIcon = ({ platform }: { platform: PublishPlatform }) => {
  if (platform === "x") return <IconXTag />;
  if (platform === "instagram") return <IconInstagramTag />;
  return <IconFacebookTag />;
};

const PREVIEW_HEADER: Record<
  PublishPlatform,
  { title: string; handle: string; PreviewIcon: typeof IconXLogo }
> = {
  x: { title: "Twitter / X", handle: "@somosbank", PreviewIcon: IconXLogo },
  instagram: { title: "Instagram", handle: "@somostbank", PreviewIcon: IconInstagram },
  facebook: { title: "Facebook", handle: "somosbank", PreviewIcon: IconFacebook },
};

export interface PostComposerProps {
  /** Called when the user chooses “Manage tags” in the tag combobox (e.g. navigate to tag admin). */
  onManageTags?: () => void;
}

export function PostComposer({ onManageTags }: PostComposerProps = {}) {
  const [groups, setGroups] = useState<ComposerTagGroup[]>(composerGroups);
  const [ungrouped, setUngrouped] = useState<ComposerTag[]>(ungroupedTags);
  const [selectedTags, setSelectedTags] = useState<ComposerTag[]>([]);
  const [textContent, setTextContent] = useState("");
  const [publishAccounts, setPublishAccounts] = useState<PublishAccount[]>(INITIAL_PUBLISH_ACCOUNTS);
  const [threadExpanded, setThreadExpanded] = useState(false);
  const [threadContent, setThreadContent] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const postSplitRef = useRef<HTMLDivElement>(null);
  /** Which surface is focused in the composer tabs — drives the right-hand preview header. */
  const [composeTab, setComposeTab] = useState<"yours" | PublishPlatform>("yours");
  const [firstComment, setFirstComment] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [owlyQuestion, setOwlyQuestion] = useState("");
  const [publishViaMobile, setPublishViaMobile] = useState(false);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const previewPlatform: PublishPlatform = useMemo(() => {
    if (composeTab !== "yours") return composeTab;
    return publishAccounts[0]?.platform ?? "x";
  }, [composeTab, publishAccounts]);

  const previewMeta = PREVIEW_HEADER[previewPlatform];
  const PreviewHeroIcon = previewMeta.PreviewIcon;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!postMenuOpen) return;
    const handle = (e: MouseEvent) => {
      if (postSplitRef.current && !postSplitRef.current.contains(e.target as Node)) {
        setPostMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [postMenuOpen]);

  const handleSelect = useCallback((tag: ComposerTag) => {
    setSelectedTags((prev) => [...prev, tag]);
  }, []);

  const handleDeselect = useCallback((tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const updateFavoriteStatus = (tagId: string, favorited: boolean) => {
    const updateTag = (t: ComposerTag) => t.id === tagId ? { ...t, favorited } : t;
    setGroups((prev) => prev.map((g) => ({ ...g, tags: g.tags.map(updateTag) })));
    setUngrouped((prev) => prev.map(updateTag));
    setSelectedTags((prev) => prev.map(updateTag));
  };

  const handleFavorite = useCallback((tagId: string) => updateFavoriteStatus(tagId, true), []);
  const handleUnfavorite = useCallback((tagId: string) => updateFavoriteStatus(tagId, false), []);

  const handleCreateTag = useCallback((name: string) => {
    const newTag: ComposerTag = { id: `ct-new-${Date.now()}`, name, groupId: null };
    setUngrouped((prev) => [...prev, newTag]);
    setSelectedTags((prev) => [...prev, newTag]);
  }, []);

  const removePublishAccount = useCallback((id: string) => {
    setPublishAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearPublishAccounts = useCallback(() => {
    setPublishAccounts([]);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--hs-comp-badge-neutral-bg)",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      {/* ═══ LEFT NAV ═══ */}
      <ProductNav activeItem="Create" onItemClick={(label) => showToast(label)} />

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* ─── HEADER ─── */}
        <header
          style={{
            height: 64,
            backgroundColor: "var(--hs-color-fill-app)",
            borderBottom: "1px solid var(--hs-color-border-subtle)",
            paddingLeft: 24,
            paddingRight: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          {/* Left side */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontSize: 26,
                lineHeight: "32px",
                fontWeight: 600,
                color: "var(--hs-color-text-base)",
              }}
            >
              Create a post
            </span>
            <button
              type="button"
              onClick={() => showToast("Account switcher")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                fontFamily: HS_FONT_FAMILY,
              }}
            >
              <AvatarImage size={32} />
              <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)" }}>
                Somos
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.25 8.75l3.75 3.75 3.75-3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* OwlyGPT button */}
            <button
              type="button"
              onClick={() => showToast("OwlyGPT activated")}
              style={{
                height: 40,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 8,
                boxShadow: "inset 0 0 0 1px var(--hs-comp-button-outlined-border)",
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontFamily: HS_FONT_FAMILY,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--hs-color-text-base)",
              }}
            >
              <IconSparkle />
              OwlyGPT
            </button>

            {/* Close fullscreen */}
            <button
              type="button"
              onClick={() => showToast("Window closed")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <IconCloseFullscreen />
            </button>

            {/* Close (X) */}
            <button
              type="button"
              onClick={() => showToast("Window closed")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <IconCloseX />
            </button>
          </div>
        </header>

        {/* ─── CONTENT AREA ─── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left panel (compose) */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "var(--hs-comp-badge-neutral-bg)",
            }}
          >
            <div
              style={{
                maxWidth: 726,
                margin: "0 auto",
                backgroundColor: "var(--hs-color-fill-app)",
                borderRadius: 16,
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 32,
                paddingBottom: 32,
                minHeight: "100%",
              }}
            >
              {/* ── Campaign (optional) — matches product composer ── */}
              <div style={{ marginBottom: 24 }}>
                <button
                  type="button"
                  onClick={() => showToast("Campaign picker")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 48,
                    paddingLeft: 16,
                    paddingRight: 12,
                    borderRadius: 8,
                    border: "1px solid var(--hs-color-border-subtle)",
                    backgroundColor: "var(--hs-color-fill-app)",
                    cursor: "pointer",
                    fontFamily: HS_FONT_FAMILY,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--hs-color-text-subtle)" }}>
                    Campaign (optional)
                  </span>
                  <IconChevronDown />
                </button>
              </div>

              {/* ── Publish to ── */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--hs-color-text-base)" }}>
                    Publish to
                  </span>
                  <button
                    type="button"
                    onClick={clearPublishAccounts}
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      fontWeight: 700,
                      color: "var(--hs-color-text-link)",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      fontFamily: HS_FONT_FAMILY,
                      padding: 0,
                    }}
                  >
                    Clear accounts
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 4,
                    minHeight: 48,
                    borderRadius: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                    backgroundColor: "var(--hs-palette-neutrals-light-10)",
                    boxShadow: "inset 0 0 0 1px var(--hs-palette-border-input)",
                  }}
                >
                  {publishAccounts.map((acct) => (
                    <span
                      key={acct.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        height: 32,
                        paddingLeft: 16,
                        paddingRight: 4,
                        borderRadius: 50,
                        backgroundColor:
                          acct.platform === "instagram"
                            ? "var(--hs-palette-complementary-orange-20)"
                            : "var(--hs-comp-tag-bg)",
                        color:
                          acct.platform === "instagram"
                            ? "var(--hs-color-text-base)"
                            : "var(--hs-color-text-brand)",
                      }}
                    >
                      <PublishPlatformIcon platform={acct.platform} />
                      <span
                        style={{
                          fontSize: 16,
                          lineHeight: "20px",
                          fontWeight: 700,
                          color:
                            acct.platform === "instagram"
                              ? "var(--hs-color-text-base)"
                              : "var(--hs-color-text-brand)",
                        }}
                      >
                        {acct.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePublishAccount(acct.id)}
                        aria-label={`Remove ${acct.name}`}
                        style={{
                          padding: 10,
                          borderRadius: "50%",
                          backgroundColor:
                            acct.platform === "instagram"
                              ? "var(--hs-palette-complementary-orange-20)"
                              : "var(--hs-comp-tag-bg)",
                          color:
                            acct.platform === "instagram"
                              ? "var(--hs-color-text-base)"
                              : "var(--hs-color-text-brand)",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => showToast("Add account")}
                    aria-label="Add publish account"
                    style={{
                      marginLeft: "auto",
                      flexShrink: 0,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6.25 8.75l3.75 3.75 3.75-3.75" stroke="var(--hs-color-text-base)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Compose area ── */}
              <div style={{ marginBottom: 24 }}>
                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    marginBottom: 0,
                  }}
                >
                  {/* "Your Post" active tab */}
                  <button
                    type="button"
                    onClick={() => setComposeTab("yours")}
                    style={{
                      position: "relative",
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingLeft: 4,
                      paddingRight: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: HS_FONT_FAMILY,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        lineHeight: "24px",
                        fontWeight: 600,
                        color: composeTab === "yours" ? "var(--hs-color-text-base)" : "var(--hs-color-text-subtle)",
                      }}
                    >
                      Your Post
                    </span>
                    {composeTab === "yours" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: "var(--hs-color-text-base)",
                        }}
                      />
                    )}
                  </button>

                  {/* X tab */}
                  <button
                    type="button"
                    onClick={() => setComposeTab("x")}
                    style={{
                      position: "relative",
                      width: 48,
                      minWidth: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <span style={{ opacity: composeTab === "x" ? 1 : 0.45 }}>
                      <IconXLogo />
                    </span>
                    {composeTab === "x" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: "var(--hs-color-text-base)",
                        }}
                      />
                    )}
                  </button>

                  {/* Instagram tab */}
                  <button
                    type="button"
                    onClick={() => setComposeTab("instagram")}
                    style={{
                      width: 48,
                      minWidth: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      position: "relative",
                    }}
                  >
                    <span style={{ opacity: composeTab === "instagram" ? 1 : 0.45 }}>
                      <IconInstagram />
                    </span>
                    {composeTab === "instagram" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: "var(--hs-color-text-base)",
                        }}
                      />
                    )}
                  </button>

                  {/* Facebook tab */}
                  <button
                    type="button"
                    onClick={() => setComposeTab("facebook")}
                    style={{
                      width: 48,
                      minWidth: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      position: "relative",
                    }}
                  >
                    <span style={{ opacity: composeTab === "facebook" ? 1 : 0.45 }}>
                      <IconFacebook />
                    </span>
                    {composeTab === "facebook" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: "var(--hs-color-text-base)",
                        }}
                      />
                    )}
                  </button>
                </div>

                {/* Text area + toolbar + media + thread card */}
                <div
                  style={{
                    borderRadius: 8,
                    border: "1px solid var(--hs-color-border-base)",
                    overflow: "hidden",
                    backgroundColor: "var(--hs-color-overlay-inverse)",
                  }}
                >
                  {/* Textarea */}
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Write your captions, then customize it for each social network"
                    style={{
                      width: "100%",
                      resize: "none",
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 12,
                      paddingBottom: 0,
                      minHeight: 40,
                      outline: "none",
                      border: "none",
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "var(--hs-color-text-subtle)",
                      backgroundColor: "transparent",
                      fontFamily: HS_FONT_FAMILY,
                    }}
                  />

                  {/* Toolbar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 4,
                      paddingBottom: 4,
                      borderBottom: "1px solid var(--hs-color-border-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Auto awesome (AI) */}
                      <button
                        type="button"
                        onClick={() => showToast("AI assist coming soon")}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <IconAutoAwesome />
                      </button>

                      {/* Tag (hashtag) */}
                      <button
                        type="button"
                        onClick={() => showToast("Add hashtag")}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <IconTag />
                      </button>

                      {/* Mood (emoji) */}
                      <button
                        type="button"
                        onClick={() => showToast("Insert emoji")}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 10,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <IconMood />
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span
                        style={{
                          fontSize: 16,
                          lineHeight: "24px",
                          fontWeight: 400,
                          color: "var(--hs-color-text-body)",
                        }}
                      >
                        {textContent.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast("Owly Writer")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: HS_FONT_FAMILY,
                          fontSize: 14,
                          lineHeight: "20px",
                          fontWeight: 700,
                          color: "var(--hs-color-text-link)",
                          padding: 0,
                        }}
                      >
                        <IconSparkle />
                        Enhance with Owly Writer AI
                      </button>
                    </div>
                  </div>

                  {/* Media area */}
                  <div
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 12,
                      paddingBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Image upload button (tonal) */}
                    <button
                      type="button"
                      onClick={() => showToast("Upload image")}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 50,
                        backgroundColor: "var(--hs-color-fill-disabled)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 12,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <IconImage />
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <button
                        type="button"
                        onClick={() => showToast("Open Canva")}
                        aria-label="Open Canva"
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--hs-color-icon-base)",
                        }}
                      >
                        <IconCanva />
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("Adobe Express")}
                        aria-label="Adobe Express"
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--hs-color-icon-base)",
                        }}
                      >
                        <IconAdobe />
                      </button>
                    </div>
                  </div>

                  {/* First comment (Instagram) */}
                  {previewPlatform === "instagram" && (
                    <div
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 12,
                        paddingBottom: 12,
                        borderTop: "1px solid var(--hs-color-border-subtle)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 16,
                          lineHeight: "24px",
                          fontWeight: 700,
                          color: "var(--hs-color-text-body)",
                          margin: "0 0 8px",
                        }}
                      >
                        First comment
                      </p>
                      <textarea
                        value={firstComment}
                        onChange={(e) => setFirstComment(e.target.value)}
                        placeholder="Optional — shown as the first comment on your post"
                        style={{
                          width: "100%",
                          resize: "vertical",
                          minHeight: 72,
                          padding: 12,
                          borderRadius: 8,
                          border: "1px solid var(--hs-color-border-subtle)",
                          outline: "none",
                          fontSize: 16,
                          lineHeight: "24px",
                          color: "var(--hs-color-text-base)",
                          backgroundColor: "var(--hs-color-fill-app)",
                          fontFamily: HS_FONT_FAMILY,
                        }}
                      />
                    </div>
                  )}

                  {/* Thread section */}
                  <div
                    style={{
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderTop: "1px solid var(--hs-color-border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 16,
                            lineHeight: "24px",
                            fontWeight: 700,
                            color: "var(--hs-color-text-body)",
                            margin: 0,
                          }}
                        >
                          Thread
                        </p>
                        <p
                          style={{
                            fontSize: 16,
                            lineHeight: "24px",
                            fontWeight: 400,
                            color: "var(--hs-color-text-base)",
                            margin: 0,
                          }}
                        >
                          Add another post to start a thread
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setThreadExpanded((v) => !v)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px 8px 8px",
                          borderRadius: 8,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: HS_FONT_FAMILY,
                        }}
                      >
                        <span style={{ opacity: threadExpanded ? 1 : 0.5, color: threadExpanded ? "var(--hs-color-text-base)" : undefined }}>
                          <IconAddCircle />
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: threadExpanded ? "var(--hs-color-text-base)" : "var(--hs-color-text-disabled)",
                          }}
                        >
                          Add
                        </span>
                      </button>
                    </div>
                    {threadExpanded && (
                      <textarea
                        value={threadContent}
                        onChange={(e) => setThreadContent(e.target.value)}
                        placeholder="Write thread post…"
                        style={{
                          width: "100%",
                          resize: "none",
                          marginTop: 12,
                          minHeight: 80,
                          padding: 12,
                          borderRadius: 8,
                          border: "1px solid var(--hs-color-border-subtle)",
                          outline: "none",
                          fontSize: 16,
                          lineHeight: "24px",
                          color: "var(--hs-color-text-subtle)",
                          backgroundColor: "color-mix(in srgb, var(--hs-color-fill-app) 90%, transparent)",
                          fontFamily: HS_FONT_FAMILY,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ── Location & request approval (product parity) ── */}
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    margin: "0 0 8px",
                  }}
                >
                  Add location
                </p>
                <InputSearch
                  placeholder="Search for a location"
                  aria-label="Add location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 20,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--hs-color-text-base)" }}>
                    Publish via mobile notification
                  </span>
                  <Switch
                    checked={publishViaMobile}
                    onChange={() => setPublishViaMobile((v) => !v)}
                    aria-label="Publish via mobile notification"
                  />
                </div>
                <Alert variant="info" title="Request approval">
                  You don&apos;t have permission to approve this post in this workspace. Ask an admin to grant approval or
                  submit for review.
                </Alert>
              </div>

              {/* ── Tag combobox ── */}
              <div style={{ marginBottom: 24 }}>
                <TagCombobox
                  label="Tag"
                  required
                  groups={groups}
                  ungrouped={ungrouped}
                  selected={selectedTags}
                  onSelect={handleSelect}
                  onDeselect={handleDeselect}
                  onClearAll={handleClearAll}
                  onFavorite={handleFavorite}
                  onUnfavorite={handleUnfavorite}
                  onCreateTag={handleCreateTag}
                  onManageTags={() => {
                    if (onManageTags) onManageTags();
                    else showToast("Tag settings");
                  }}
                />
              </div>
            </div>
          </div>

          {/* ═══ CENTER — live preview (Hootsuite-style three-column layout) ═══ */}
          <div
            role="region"
            aria-label="Live preview"
            style={{
              width: 400,
              flexShrink: 0,
              backgroundColor: "var(--hs-comp-badge-neutral-bg)",
              borderLeft: "1px solid var(--hs-color-border-subtle)",
              overflowY: "auto",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 24,
              paddingBottom: 24,
            }}
          >
            <p
              style={{
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--hs-color-text-subtle)",
                margin: "0 0 16px",
              }}
            >
              Preview
            </p>
            {previewPlatform === "instagram" ? (
              <div
                style={{
                  maxWidth: 360,
                  margin: "0 auto",
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "var(--hs-color-fill-app)",
                  border: "1px solid var(--hs-color-border-subtle)",
                  boxShadow: "var(--hs-comp-card-shadow-raised)",
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid var(--hs-color-border-subtle)",
                  }}
                >
                  <span style={{ fontSize: 18, color: "var(--hs-color-text-base)" }} aria-hidden>
                    ←
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--hs-color-text-base)" }}>somostbank</span>
                  <span style={{ fontWeight: 700, color: "var(--hs-color-text-base)" }} aria-hidden>
                    ···
                  </span>
                </div>
                <div
                  style={{
                    aspectRatio: "1",
                    backgroundColor: "var(--hs-color-fill-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "var(--hs-color-text-muted)",
                  }}
                >
                  Image or video
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    color: "var(--hs-color-text-base)",
                  }}
                >
                  <span aria-hidden>♡</span>
                  <span aria-hidden>💬</span>
                  <span aria-hidden>↗</span>
                  <span aria-hidden style={{ marginLeft: "auto" }}>
                    🔖
                  </span>
                </div>
                <p style={{ padding: "0 12px", margin: "0 0 8px", fontWeight: 600, fontSize: 14, color: "var(--hs-color-text-base)" }}>
                  891 likes
                </p>
                <div style={{ padding: "0 12px 12px", fontSize: 14, lineHeight: 1.5, color: "var(--hs-color-text-body)" }}>
                  <strong>somostbank</strong>{" "}
                  {textContent.trim() ? (
                    <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{textContent}</span>
                  ) : (
                    <span style={{ color: "var(--hs-color-text-subtle)", fontStyle: "italic" }}>Write a caption on the left…</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Invite collaborators")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    border: "none",
                    borderTop: "1px solid var(--hs-color-border-subtle)",
                    background: "var(--hs-color-fill-app)",
                    cursor: "pointer",
                    fontFamily: HS_FONT_FAMILY,
                    fontSize: 13,
                    color: "var(--hs-color-text-subtle)",
                  }}
                >
                  <span>Invite collaborators</span>
                  <span aria-hidden>▼</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Tag people")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    border: "none",
                    borderTop: "1px solid var(--hs-color-border-subtle)",
                    background: "var(--hs-color-fill-app)",
                    cursor: "pointer",
                    fontFamily: HS_FONT_FAMILY,
                    fontSize: 13,
                    color: "var(--hs-color-text-subtle)",
                  }}
                >
                  <span>Click on image to tag people</span>
                  <span aria-hidden>▼</span>
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "var(--hs-color-fill-app)",
                    borderRadius: 12,
                    padding: 16,
                    border: "1px solid var(--hs-color-border-subtle)",
                    boxShadow: "var(--hs-comp-card-shadow-raised)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PreviewHeroIcon size={32} />
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        lineHeight: "25px",
                        fontWeight: 700,
                        color: "var(--hs-color-text-base)",
                      }}
                    >
                      {previewMeta.title}
                    </span>
                  </div>

                  {/* Live preview card */}
                  <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
                <AvatarImage size={40} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: "20px",
                      fontWeight: 700,
                      color: "var(--hs-color-text-base)",
                    }}
                  >
                    Somos Bank
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "18px",
                      fontWeight: 400,
                      color: "var(--hs-color-text-timestamps)",
                    }}
                  >
                    {previewMeta.handle}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "18px",
                      fontWeight: 400,
                      color: "var(--hs-color-text-timestamps)",
                    }}
                  >
                    · Just now
                  </span>
                </div>

                {/* Post body (synced from composer) */}
                <div style={{ marginTop: 8 }}>
                  {textContent.trim() ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: "20px",
                        fontWeight: 400,
                        color: "var(--hs-color-text-body)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {textContent}
                    </p>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: "20px",
                        color: "var(--hs-color-text-subtle)",
                        fontStyle: "italic",
                      }}
                    >
                      Nothing to preview yet — start writing on the left.
                    </p>
                  )}
                </div>

                {previewPlatform === "x" && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 13,
                      lineHeight: "16px",
                      color: textContent.length > 280 ? "var(--hs-color-text-critical)" : "var(--hs-color-text-subtle)",
                    }}
                  >
                    {textContent.length} / 280 characters
                  </p>
                )}

                {/* Tags (synced) */}
                {selectedTags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 10,
                    }}
                  >
                    {selectedTags.map((t) => (
                      <span
                        key={t.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          height: 26,
                          paddingLeft: 10,
                          paddingRight: 10,
                          borderRadius: 999,
                          backgroundColor: "var(--hs-comp-tag-bg)",
                          color: "var(--hs-color-text-brand)",
                          fontSize: 14,
                          lineHeight: "18px",
                          fontWeight: 700,
                        }}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Thread preview */}
                {threadExpanded && threadContent.trim() ? (
                  <div
                    style={{
                      marginTop: 12,
                      paddingLeft: 12,
                      borderLeft: "2px solid var(--hs-color-border-subtle)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: "18px",
                        fontWeight: 600,
                        color: "var(--hs-color-text-subtle)",
                      }}
                    >
                      Thread
                    </p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 15,
                        lineHeight: "20px",
                        color: "var(--hs-color-text-body)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {threadContent}
                    </p>
                  </div>
                ) : null}

                {/* Social actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 40,
                    marginTop: 16,
                    color: "var(--hs-color-border-base)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => showToast("Reply (preview)")}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 14l-3 2V6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Repost (preview)")}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 6h5l2-3 2 3h5M7 6v6M11 6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Like (preview)")}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 17s-7-4.35-7-8.5A3.5 3.5 0 0 1 10 5.98 3.5 3.5 0 0 1 17 8.5C17 12.65 10 17 10 17z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("More (preview)")}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="5" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
                </div>
              </>
            )}
          </div>

          {/* ═══ RIGHT — OwlyGPT Assistant (matches product sidebar) ═══ */}
          <aside
            aria-label="OwlyGPT Assistant"
            style={{
              width: 340,
              flexShrink: 0,
              backgroundColor: "var(--hs-color-fill-app)",
              borderLeft: "1px solid var(--hs-color-border-subtle)",
              overflowY: "auto",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 24,
              paddingBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                lineHeight: "24px",
                fontWeight: 700,
                color: "var(--hs-color-text-base)",
                margin: "0 0 4px",
              }}
            >
              OwlyGPT Assistant
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--hs-color-text-subtle)",
                margin: "0 0 20px",
              }}
            >
              Proactive suggestions for reach, hashtags, and tone — same lane as the composer, not floating toasts.
            </p>
            {OWLY_SUGGESTIONS.map((s) => (
              <CardSurface
                key={s.id}
                variant="flat"
                padding="medium"
                style={{
                  marginBottom: 12,
                  border: "1px solid var(--hs-color-border-subtle)",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    margin: "0 0 8px",
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: "18px",
                    color: "var(--hs-color-text-subtle)",
                    margin: "0 0 12px",
                  }}
                >
                  {s.body}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="!min-h-[36px] !py-1.5 !text-hs-button-small"
                  onClick={() => showToast(`Optimize: ${s.title}`)}
                >
                  Optimize
                </Button>
              </CardSurface>
            ))}
            <div style={{ marginTop: 8 }}>
              <Input
                placeholder="Ask OwlyGPT a question"
                value={owlyQuestion}
                onChange={(e) => setOwlyQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    showToast(owlyQuestion.trim() ? `Owly: ${owlyQuestion}` : "Ask a question first");
                    setOwlyQuestion("");
                  }
                }}
                aria-label="Ask OwlyGPT a question"
              />
            </div>
          </aside>
        </div>

        {/* ─── FOOTER ─── */}
        <footer
          style={{
            height: 64,
            backgroundColor: "var(--hs-color-fill-app)",
            borderTop: "1px solid var(--hs-color-border-subtle)",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 8,
            paddingBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 24,
            flexShrink: 0,
          }}
        >
          {/* Manage campaigns */}
          <button
            type="button"
            onClick={() => showToast("Campaign manager")}
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: HS_FONT_FAMILY,
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            Manage campaigns
          </button>

          {/* Save as draft */}
          <button
            type="button"
            onClick={() => showToast("Draft saved")}
            style={{
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 700,
              color: "var(--hs-color-text-base)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: HS_FONT_FAMILY,
            }}
          >
            Save as draft
          </button>

          {/* Schedule for later chip */}
          <button
            type="button"
            onClick={() => showToast("Schedule picker coming soon")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 16,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 999,
              backgroundColor: "var(--hs-color-fill-disabled)",
              cursor: "pointer",
              border: "none",
              fontFamily: HS_FONT_FAMILY,
            }}
          >
            <span
              style={{
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 600,
                color: "var(--hs-color-text-base)",
              }}
            >
              Schedule for later
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          {/* Split button: Post now */}
          <div ref={postSplitRef} style={{ position: "relative", display: "flex", alignItems: "stretch", gap: 1 }}>
            <button
              type="button"
              onClick={() => showToast("Post published!")}
              style={{
                height: 48,
                paddingLeft: 24,
                paddingRight: 24,
                paddingTop: 12,
                paddingBottom: 12,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: "var(--hs-comp-button-filled-bg)",
                color: "var(--hs-color-fill-app)",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: HS_FONT_FAMILY,
              }}
            >
              Post now
            </button>
            <button
              type="button"
              aria-expanded={postMenuOpen}
              aria-haspopup="menu"
              onClick={() => setPostMenuOpen((o) => !o)}
              style={{
                width: 48,
                height: 48,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: "var(--hs-comp-button-filled-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.25 8.75l3.75 3.75 3.75-3.75" stroke="var(--hs-color-fill-app)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {postMenuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "100%",
                  marginBottom: 4,
                  minWidth: 200,
                  borderRadius: 8,
                  backgroundColor: "var(--hs-color-fill-app)",
                  boxShadow: "var(--hs-shadow-overlay-bottom)",
                  border: "1px solid var(--hs-color-border-subtle)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPostMenuOpen(false);
                    showToast("Schedule picker coming soon");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    background: "var(--hs-color-fill-app)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    fontFamily: HS_FONT_FAMILY,
                  }}
                >
                  Schedule for later
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPostMenuOpen(false);
                    showToast("Draft saved");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    background: "var(--hs-color-fill-app)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--hs-color-text-base)",
                    fontFamily: HS_FONT_FAMILY,
                    borderTop: "1px solid var(--hs-color-border-subtle)",
                  }}
                >
                  Save as draft
                </button>
              </div>
            )}
          </div>
        </footer>
      </div>

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 400,
            width: "calc(100% - 32px)",
            padding: 16,
            borderRadius: 8,
            backgroundColor: "var(--hs-color-text-base)",
            color: "var(--hs-color-fill-app)",
            fontSize: 14,
            lineHeight: "20px",
            fontFamily: HS_FONT_FAMILY,
            zIndex: 10000,
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
