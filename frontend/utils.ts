import { Panel, PanelKey } from "../common/panel.ts";

/** Filters the provided panels to just journal panels, sorted chronologically. */
export function filterToJournalPanels(
  panels: Map<PanelKey, Panel>,
): Panel[] {
  return [...panels.values()]
    .filter((panel) => panel.metadata.type === "blog")
    .sort((a, b) => b.metadata.date!.localeCompare(a.metadata.date!));
}

export function genRandomString() {
  return Math.random().toString(36).slice(2);
}
