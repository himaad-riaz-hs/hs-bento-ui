import type { ComposerTag, ComposerTagGroup } from "./types";

export const composerTags: ComposerTag[] = [
  { id: "ct1", name: "Coke", groupId: "cg1" },
  { id: "ct2", name: "Luma", groupId: "cg1", favorited: true },
  { id: "ct3", name: "Nexo", groupId: "cg1" },
  { id: "ct4", name: "Oro", groupId: "cg1" },
  { id: "ct5", name: "Pepsi", groupId: "cg1" },
  { id: "ct6", name: "Summer2026", groupId: "cg2" },
  { id: "ct7", name: "Winter2026", groupId: "cg2" },
  { id: "ct8", name: "Holiday2026", groupId: "cg2" },
  { id: "ct9", name: "Back-to-School", groupId: "cg2" },
  { id: "ct10", name: "New Year", groupId: "cg2" },
  { id: "ct11", name: "Sunscreen", groupId: "cg3" },
  { id: "ct12", name: "Moisturizer", groupId: "cg3" },
  { id: "ct13", name: "Shampoo", groupId: "cg3" },
];

export const composerGroups: ComposerTagGroup[] = [
  {
    id: "cg1",
    name: "Brand",
    required: true,
    tags: composerTags.filter((t) => t.groupId === "cg1"),
  },
  {
    id: "cg2",
    name: "Campaign",
    required: true,
    tags: composerTags.filter((t) => t.groupId === "cg2"),
  },
  {
    id: "cg3",
    name: "Product Category",
    required: false,
    tags: composerTags.filter((t) => t.groupId === "cg3"),
  },
];

export const ungroupedTags: ComposerTag[] = [];
