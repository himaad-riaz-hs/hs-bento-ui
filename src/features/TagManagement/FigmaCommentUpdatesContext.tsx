import { createContext, useContext, type ReactNode } from "react";

const FigmaCommentUpdatesContext = createContext(false);

export function FigmaCommentUpdatesProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <FigmaCommentUpdatesContext.Provider value={enabled}>{children}</FigmaCommentUpdatesContext.Provider>
  );
}

/** When false (default), Figma inline notes are hidden — safe outside the interactive prototype. */
export function useFigmaCommentUpdatesEnabled(): boolean {
  return useContext(FigmaCommentUpdatesContext);
}
