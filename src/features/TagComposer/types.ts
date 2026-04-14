export interface ComposerTag {
  id: string;
  name: string;
  groupId: string | null;
  favorited?: boolean;
}

export interface ComposerTagGroup {
  id: string;
  name: string;
  required: boolean;
  tags: ComposerTag[];
}
