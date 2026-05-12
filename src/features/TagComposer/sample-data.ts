import type { ComposerTag, ComposerTagGroup } from "./types";

export const composerTags: ComposerTag[] = [
  { id: "ct1", name: "Coke", groupId: "cg1" },
  { id: "ct2", name: "Luma", groupId: "cg1" },
  { id: "ct3", name: "Nexo", groupId: "cg1" },
  { id: "ct4", name: "Oro", groupId: "cg1" },
  { id: "ct5", name: "Pepsi", groupId: "cg1" },
  { id: "ct6", name: "Back-to-School", groupId: "cg2" },
  { id: "ct7", name: "Holiday2026", groupId: "cg2" },
  { id: "ct8", name: "New Year", groupId: "cg2" },
  { id: "ct9", name: "Summer2026", groupId: "cg2" },
  { id: "ct10", name: "Winter2026", groupId: "cg2" },
  { id: "ct11", name: "Australia", groupId: "cg3" },
  { id: "ct12", name: "Canada", groupId: "cg3" },
  { id: "ct13", name: "Germany", groupId: "cg3" },
  { id: "ct14", name: "UK", groupId: "cg3" },
  { id: "ct15", name: "USA", groupId: "cg3" },
  { id: "ct16", name: "Apparel", groupId: "cg4" },
  { id: "ct17", name: "Electronics", groupId: "cg4" },
  { id: "ct18", name: "Home & Garden", groupId: "cg4" },
  { id: "ct19", name: "Sports", groupId: "cg4" },
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
    name: "Country",
    required: false,
    tags: composerTags.filter((t) => t.groupId === "cg3"),
  },
  {
    id: "cg4",
    name: "Product Category",
    required: false,
    tags: composerTags.filter((t) => t.groupId === "cg4"),
  },
];

export const ungroupedTags: ComposerTag[] = [];
