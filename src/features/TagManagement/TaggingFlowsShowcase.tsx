import type { ReactNode } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { TagManagement } from "./TagManagement";
import { PostComposer } from "../TagComposer/PostComposer";
import { ComposerTagAdminFlow } from "../TagComposer/ComposerTagAdminFlow";

const FIGMA =
  "https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445";

type FlowSection = {
  id: string;
  title: string;
  blurb: string;
  /** Fixed chrome height so each artboard reads like a desktop slice */
  height: number;
  node: ReactNode;
};

/**
 * Vertical “museum” of tagging-related flows — scroll to review everything in one Storybook entry.
 * Pairs with Figma [Tagging — Section 3990:40445](https://www.figma.com/design/FWbrDllz3IolgLMzPlqvyX/Tagging?node-id=3990-40445).
 */
export function TaggingFlowsShowcase() {
  const sections: FlowSection[] = [
    {
      id: "hub-default",
      title: "Tag hub — full sample data",
      blurb: "688px column, tabs → search → actions → group cards (matches stacked Tag artboards).",
      height: 920,
      node: <TagManagement key="hub-default" layout="hub" dataPreset="default" embedded />,
    },
    {
      id: "hub-many",
      title: "Tag hub — many groups",
      blurb: "Dense list of groups + two tags each (scroll inside frame).",
      height: 920,
      node: <TagManagement key="hub-many" layout="hub" dataPreset="many" embedded />,
    },
    {
      id: "hub-single",
      title: "Tag hub — single group",
      blurb: "One “Brand” group + empty ungrouped — minimal canvas.",
      height: 720,
      node: <TagManagement key="hub-single" layout="hub" dataPreset="single" embedded />,
    },
    {
      id: "hub-empty",
      title: "Tag hub — empty state",
      blurb: "No groups except empty ungrouped — copy for “create your first group”.",
      height: 720,
      node: <TagManagement key="hub-empty" layout="hub" dataPreset="empty" embedded />,
    },
    {
      id: "hub-archived",
      title: "Tag hub — Archived tab",
      blurb: "Opens on Archived — archived tags + groups tables.",
      height: 920,
      node: (
        <TagManagement key="hub-archived" layout="hub" dataPreset="default" initialTab="archived" embedded />
      ),
    },
    {
      id: "hub-ungrouped",
      title: "Tag hub — Ungrouped tab",
      blurb: "Opens on Ungrouped tags table + bulk selection pattern.",
      height: 920,
      node: (
        <TagManagement
          key="hub-ungrouped"
          layout="hub"
          dataPreset="default"
          initialTab="ungrouped"
          embedded
        />
      ),
    },
    {
      id: "settings-full",
      title: "Tag admin — Settings shell (legacy)",
      blurb: "Product nav + Settings drawer + Tags — original full layout.",
      height: 920,
      node: <TagManagement key="settings-full" layout="full" dataPreset="default" embedded />,
    },
    {
      id: "composer-shell",
      title: "Composer — create post",
      blurb: "Full composer surface (tag combobox, networks, preview).",
      height: 900,
      node: <PostComposer key="composer" />,
    },
    {
      id: "composer-admin",
      title: "Composer ↔ Tag admin (toggle)",
      blurb: "Switch between PostComposer and TagManagement hub via “Manage tags”.",
      height: 900,
      node: <ComposerTagAdminFlow key="composer-admin" />,
    },
  ];

  return (
    <div
      style={{
        fontFamily: HS_FONT_FAMILY,
        background: "var(--hs-comp-badge-neutral-bg)",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      <header
        style={{
          padding: "32px 24px 24px",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            lineHeight: "36px",
            fontWeight: 600,
            color: "var(--hs-color-text-base)",
          }}
        >
          Tagging — all flows
        </h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "var(--hs-color-text-subtle)", maxWidth: 720 }}>
          Scroll through live React builds aligned to the{" "}
          <a href={FIGMA} style={{ color: "var(--hs-color-text-link)" }}>
            Tagging Figma file (Section 3990:40445)
          </a>
          . Each block is an isolated instance (own state). Use this story for QA and handoff.
        </p>
      </header>

      {sections.map((s) => (
        <section
          key={s.id}
          style={{
            maxWidth: 1200,
            margin: "0 auto 48px",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 18,
              lineHeight: "24px",
              fontWeight: 600,
              color: "var(--hs-color-text-base)",
            }}
          >
            {s.title}
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: "22px", color: "var(--hs-color-text-subtle)" }}>
            {s.blurb}
          </p>
          <div
            style={{
              height: s.height,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--hs-color-border-subtle)",
              background: "var(--hs-color-fill-base)",
              boxShadow: "var(--hs-comp-card-shadow-raised)",
            }}
          >
            {s.node}
          </div>
        </section>
      ))}
    </div>
  );
}
