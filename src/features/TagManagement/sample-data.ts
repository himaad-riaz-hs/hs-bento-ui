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

  // Content Type group
  { id: "t8", name: "Blog Post", groupId: "g1", color: TAG_SWATCH.blue },
  { id: "t9", name: "Social Media", groupId: "g1", color: TAG_SWATCH.green },
  { id: "t10", name: "Landing Page", groupId: "g1", color: TAG_SWATCH.purple },
  { id: "t11", name: "Video", groupId: "g1", color: TAG_SWATCH.yellow },

  // Lead Status group
  { id: "t12", name: "Lead Gen", groupId: "g2", color: TAG_SWATCH.blue },
  { id: "t13", name: "MQL", groupId: "g2", color: TAG_SWATCH.green },
  { id: "t14", name: "SQL", groupId: "g2", color: TAG_SWATCH.pink },

  // Segment group
  { id: "t15", name: "Enterprise", groupId: "g3", color: TAG_SWATCH.purple },
  { id: "t16", name: "Mid-Market", groupId: "g3", color: TAG_SWATCH.blue },
  { id: "t17", name: "SMB", groupId: "g3", color: TAG_SWATCH.yellow },
  { id: "t18", name: "Startup", groupId: "g3", color: TAG_SWATCH.green },
  { id: "t19", name: "Agency", groupId: "g3", color: TAG_SWATCH.pink },

  // Region group
  { id: "t20", name: "North America", groupId: "g4", color: TAG_SWATCH.blue },
  { id: "t21", name: "EMEA", groupId: "g4", color: TAG_SWATCH.purple },
  { id: "t22", name: "APAC", groupId: "g4", color: TAG_SWATCH.yellow },
  { id: "t23", name: "LATAM", groupId: "g4", color: TAG_SWATCH.green },

  // Archived tags
  { id: "t24", name: "Legacy Campaign", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
  { id: "t25", name: "Old Promo", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
  { id: "t26", name: "Deprecated", groupId: null, color: TAG_SWATCH_NEUTRAL, archived: true },
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
    name: "Content Type",
    required: true,
    visibility: "everyone",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g1"),
  },
  {
    id: "g2",
    name: "Lead Status",
    required: true,
    visibility: "everyone",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g2"),
  },
  {
    id: "g3",
    name: "Segment",
    required: false,
    visibility: "everyone",
    permissions: "everyone",
    tags: sampleTags.filter((t) => t.groupId === "g3"),
  },
  {
    id: "g4",
    name: "Region",
    required: false,
    visibility: "admins",
    permissions: "admin",
    tags: sampleTags.filter((t) => t.groupId === "g4"),
  },
];

export const sampleArchivedGroups: TagGroup[] = [
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

export const sampleArchivedTags: Tag[] = sampleTags.filter((t) => t.archived);
