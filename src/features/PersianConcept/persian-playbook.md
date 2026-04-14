# Persian — Operations hub playbook

## What this screen is

- **Claude / LLM** = where people plan and draft.
- **Persian Operations hub** = where **approvals**, **MCP health**, **automations**, and **proactive policy** live — governance, not ideation.

## Embedded prompt

See **`PERSIAN_EXPERIENCE_PROMPT`** in `PersianJourney.tsx` (exported).

## Sections (Storybook)

1. **KPI strip** — pending approvals, automations on, MCP server health count, proactive count.
2. **Approvals queue** — table with source badges (Claude MCP / Persian / Workflow), Approve · Reject · View (drawer stub).
3. **MCP & connectors** — per-server status, tool count, sync time.
4. **Proactive** — stacked alerts, dismissible.
5. **Automations** — toggles for named workflows.
6. **Ops chat** — short thread + chips (`/queue claude`, etc.) + composer.

## Follow-up prompts for Cursor

> Wire `approvals` to a GET `/api/approvals` and optimistic PATCH on Approve.

> Add role-based visibility: only `org_admin` sees MCP manifest link.

> Persist automation toggles to backend and show toast on change.
