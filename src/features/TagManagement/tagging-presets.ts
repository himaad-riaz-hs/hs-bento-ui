import type { Tag, TagGroup } from "./types";
import { sampleArchivedGroups, sampleArchivedTags, sampleGroups } from "./sample-data";
import { TAG_SWATCH } from "./tag-palette";

/** Swatch cycle for generated demo tags */
const PALETTE = [
  TAG_SWATCH.blue,
  TAG_SWATCH.green,
  TAG_SWATCH.purple,
  TAG_SWATCH.yellow,
  TAG_SWATCH.pink,
] as const;

export type TaggingDataPreset = "default" | "empty" | "singleEmpty" | "single" | "many";

export interface TaggingSeedData {
  groups: TagGroup[];
  archivedTags: Tag[];
  archivedGroups: TagGroup[];
}

function ungroupedShell(tags: Tag[]): TagGroup {
  return {
    id: "ungrouped",
    name: "Ungrouped tags",
    required: false,
    visibility: "everyone",
    permissions: "admin",
    tags,
  };
}

/** Seeded data for Storybook / Figma parity — maps to artboards in Tagging file Section 3990:40445. */
export function getTaggingPreset(preset: TaggingDataPreset): TaggingSeedData {
  const archivedTags = structuredClone(sampleArchivedTags);
  const archivedGroups = structuredClone(sampleArchivedGroups);

  switch (preset) {
    case "empty":
      return {
        groups: [ungroupedShell([])],
        archivedTags: [],
        archivedGroups: [],
      };

    case "singleEmpty":
      return {
        groups: [
          ungroupedShell([]),
          {
            id: "g-brand",
            name: "Brand",
            required: false,
            visibility: "everyone",
            permissions: "everyone",
            tags: [],
          },
        ],
        archivedTags,
        archivedGroups,
      };

    case "single":
      return {
        groups: [
          ungroupedShell([]),
          {
            id: "g-brand",
            name: "Brand",
            required: false,
            visibility: "everyone",
            permissions: "everyone",
            tags: [
              { id: "tb1", name: "Brand Identifier", groupId: "g-brand", color: PALETTE[0] },
              { id: "tb2", name: "Corporate Label", groupId: "g-brand", color: PALETTE[3] },
            ],
          },
        ],
        archivedTags,
        archivedGroups,
      };

    case "many": {
      const groupNames = [
        "Campaign",
        "Content Type",
        "Region",
        "Product",
        "Audience",
        "Channel",
        "Lifecycle",
        "Priority",
        "Team",
        "Topic",
        "Format",
        "Language",
        "Season",
        "Offer",
        "Intent",
      ];
      const groups: TagGroup[] = [ungroupedShell([])];
      for (let i = 0; i < groupNames.length; i++) {
        const gid = `g-many-${i}`;
        groups.push({
          id: gid,
          name: groupNames[i]!,
          required: i % 3 === 0,
          visibility: i % 2 === 0 ? "everyone" : "admins",
          permissions: i % 4 === 0 ? "everyone" : "admin",
          tags: [
            {
              id: `${gid}-a`,
              name: "Sample tag A",
              groupId: gid,
              color: PALETTE[i % PALETTE.length],
            },
            {
              id: `${gid}-b`,
              name: "Sample tag B",
              groupId: gid,
              color: PALETTE[(i + 1) % PALETTE.length],
            },
          ],
        });
      }
      return { groups, archivedTags, archivedGroups };
    }

    case "default":
    default:
      return {
        groups: structuredClone(sampleGroups),
        archivedTags,
        archivedGroups,
      };
  }
}
