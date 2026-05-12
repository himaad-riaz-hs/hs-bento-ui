import type { Tag, TagGroup } from "./types";
import { TAG_SWATCH, TAG_SWATCH_NEUTRAL } from "./tag-palette";

export const sampleTags: Tag[] = [
  // Ungrouped tags (7+)
  { id: "t1", name: "Campaign", groupId: null, color: TAG_SWATCH.blue },
  { id: "t2", name: "Newsletter", groupId: null, color: TAG_SWATCH.green },
  { id: "t3", name: "Product Update", groupId: null, color: TAG_SWATCH.purple },
  { id: "t4", name: "Internal", groupId: null, color: TAG_SWATCH.yellow },
  { id: "t5", name: "Urgent", groupId: null, color: TAG_SWATCH.pink },
  { id: "t6", name: "Seasonal", groupId: null, color: TAG_SWATCH.blue },
  { id: "t7", name: "Evergreen", groupId: null, color: TAG_SWATCH.green },

  // Brand group
  { id: "t8", name: "Coke", groupId: "g1", color: TAG_SWATCH.pink },
  { id: "t9", name: "Doritos", groupId: "g1", color: TAG_SWATCH.yellow },
  { id: "t10", name: "Frito-Lay", groupId: "g1", color: TAG_SWATCH.yellow },
  { id: "t11", name: "Gatorade", groupId: "g1", color: TAG_SWATCH.blue },

  // Campaign group
  { id: "t12", name: "Summer2026", groupId: "g2", color: TAG_SWATCH.blue },
  { id: "t13", name: "Winter2026", groupId: "g2", color: TAG_SWATCH.purple },
  { id: "t14", name: "Holiday2026", groupId: "g2", color: TAG_SWATCH.green },
  { id: "t15", name: "Back-to-School", groupId: "g2", color: TAG_SWATCH.pink },

  // Country group
  { id: "t16", name: "Canada", groupId: "g3", color: TAG_SWATCH.blue },
  { id: "t17", name: "USA", groupId: "g3", color: TAG_SWATCH.green },
  { id: "t18", name: "UK", groupId: "g3", color: TAG_SWATCH.purple },
  { id: "t19", name: "Australia", groupId: "g3", color: TAG_SWATCH.yellow },
  { id: "t20", name: "Germany", groupId: "g3", color: TAG_SWATCH.pink },

  // Product Category group
  { id: "t21", name: "Sunscreen", groupId: "g4", color: TAG_SWATCH.blue },
  { id: "t22", name: "Moisturizer", groupId: "g4", color: TAG_SWATCH.green },
  { id: "t23", name: "Shampoo", groupId: "g4", color: TAG_SWATCH.purple },
  { id: "t24-cond", name: "Conditioner", groupId: "g4", color: TAG_SWATCH.yellow },

  // Archived tags
  { id: "t-arch1", name: "Legacy Campaign", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
  { id: "t-arch2", name: "Old Promo", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
  { id: "t-arch3", name: "Deprecated", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
];

export const sampleGroups: TagGroup[] = [
  {
    id: "ungrouped",
    name: "Ungrouped tags",
    required: false,
    visibility: "everyone",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === null && !t.archived),
  },
  {
    id: "g1",
    name: "Brand",
    required: true,
    visibility: "everyone",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g1"),
  },
  {
    id: "g2",
    name: "Campaign",
    required: true,
    visibility: "everyone",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g2"),
  },
  {
    id: "g3",
    name: "Country",
    required: false,
    visibility: "everyone",
    permissions: "everyone",
    tags: sampleTags.filter((t) => t.groupId === "g3"),
  },
  {
    id: "g4",
    name: "Product Category",
    required: false,
    visibility: "admins",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g4"),
  },
];

export const sampleArchivedGroups: TagGroup[] = [
  {
    id: "g-brand-arch",
    name: "Brand",
    required: false,
    visibility: "everyone",
    permissions: "everyone",
    tags: [],
    archived: true,
  },
  {
    id: "g-archived-1",
    name: "Old Campaigns",
    required: false,
    visibility: "everyone",
    permissions: "admin",
    tags: [],
    archived: true,
  },
];

/** Archived tags: grouped under `g-brand-arch` (Figma Archived hub) + legacy ungrouped archived samples. */
export const sampleArchivedTags: Tag[] = [
  { id: "t-arch-coke", name: "Coke", groupId: "g-brand-arch", color: TAG_SWATCH_NEUTRAL, archived: true },
  ...sampleTags.filter((t) => t.archived),
];
