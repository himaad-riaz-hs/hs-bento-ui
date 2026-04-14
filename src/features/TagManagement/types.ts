export interface Tag {
  id: string;
  name: string;
  groupId: string | null;
  color: string;
  archived?: boolean;
}

export interface TagGroup {
  id: string;
  name: string;
  required: boolean;
  visibility: "everyone" | "admins";
  permissions: "admin" | "everyone";
  tags: Tag[];
  archived?: boolean;
}

export type TabValue = "groups" | "ungrouped" | "archived";
