#!/usr/bin/env python3
"""One-off: replace common hex in feature demo files with HS-Bento CSS variables."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "src/features/TagComposer/PostComposer.tsx",
    ROOT / "src/features/TagManagement/TagManagement.tsx",
    ROOT / "src/features/TagManagement/TagGroupCard.tsx",
]

# Longer / compound patterns first
REPLACEMENTS: list[tuple[str, str]] = [
    (
        "linear-gradient(180deg, #eef5fb 0%, #e9f0fc 100%)",
        "linear-gradient(180deg, var(--hs-comp-surface-info-tint-start) 0%, var(--hs-comp-surface-info-tint-end) 100%)",
    ),
    ('borderBottom: "1px solid #c4d9e2"', 'borderBottom: "1px solid var(--hs-comp-surface-info-tint-border)"'),
    (
        "0px 0px 1px rgba(28,28,28,0.28), 0px 8px 16px rgba(28,28,28,0.16)",
        "var(--hs-comp-menu-shadow)",
    ),
    (
        "0px 8px 16px rgba(28,28,28,0.16), 0px 0px 1px rgba(28,28,28,0.28)",
        "var(--hs-comp-menu-shadow)",
    ),
    ("rgba(0,0,0,0.25)", "var(--hs-color-overlay-scrim)"),
    ("rgba(0,0,0,0.2)", "var(--hs-color-overlay-scrim)"),
    ("rgba(255,255,255,0.64)", "var(--hs-color-overlay-inverse)"),
    ("rgba(255,255,255,0.9)", "color-mix(in srgb, var(--hs-color-fill-app) 90%, transparent)"),
    ("0px 4px 16px rgba(28,28,28,0.16)", "var(--hs-shadow-overlay-bottom)"),
    ("0 8px 24px rgba(0,0,0,0.2)", "var(--hs-shadow-overlay-bottom)"),
    ("0px 8px 24px rgba(28,28,28,0.18)", "var(--hs-shadow-overlay-bottom)"),
    ('inset 0 0 0 1px #1c1c1c', "inset 0 0 0 1px var(--hs-comp-button-outlined-border)"),
    ('inset 0 0 0 1px #7c797a', "inset 0 0 0 1px var(--hs-palette-border-input)"),
    ("#012b3a", "var(--hs-comp-button-filled-bg)"),
    ("#143059", "var(--hs-color-text-brand)"),
    ("#fde2d3", "var(--hs-comp-tag-bg)"),
    ("#2f6b9a", "var(--hs-color-text-link)"),
    ("#c9372c", "var(--hs-color-text-critical)"),
    ("#fdfdfd", "var(--hs-color-fill-app)"),
    ("#1c1c1c", "var(--hs-color-text-base)"),
    ("#ebebeb", "var(--hs-color-border-subtle)"),
    ("#5c5c5c", "var(--hs-color-text-subtle)"),
    ("#767676", "var(--hs-color-border-base)"),
    ("#f4f5f6", "var(--hs-comp-badge-neutral-bg)"),
    ("#a1a1a1", "var(--hs-color-text-disabled)"),
    ("#eef1f2", "var(--hs-color-fill-disabled)"),
    ("#eef3f5", "var(--hs-comp-badge-neutral-bg)"),
    ("#241f21", "var(--hs-color-text-body)"),
    ("#504c4d", "var(--hs-color-text-timestamps)"),
    ("#536471", "var(--hs-color-text-subtle)"),
    ("#0f1419", "var(--hs-color-text-body)"),
    ("#000000", "var(--hs-color-text-base)"),
    ("#d3d2d3", "var(--hs-color-border-subtle)"),
    ("#fcfcfb", "var(--hs-palette-neutrals-light-10)"),
    ("#7c797a", "var(--hs-palette-border-input)"),
    ('stroke="#1c1c1c"', 'stroke="var(--hs-color-icon-base)"'),
    ('stroke="#fdfdfd"', 'stroke="var(--hs-color-text-inverse)"'),
    ('stroke="#5c5c5c"', 'stroke="var(--hs-color-icon-subtle)"'),
    ('fill="#16a34a"', 'fill="var(--hs-color-fill-positive)"'),
    ('stroke="#fff"', 'stroke="var(--hs-color-text-inverse)"'),
]


def main() -> None:
    for path in FILES:
        if not path.exists():
            raise SystemExit(f"missing {path}")
        text = path.read_text(encoding="utf-8")
        orig = text
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print(f"updated {path.relative_to(ROOT)}")
        else:
            print(f"unchanged {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
