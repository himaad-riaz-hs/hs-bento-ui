import { useCallback, useEffect, useMemo, useState } from "react";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";
import { ActionBar, ActionBarDivider } from "../../components/ActionBar";
import { Alert } from "../../components/Alert";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ButtonInfo } from "../../components/ButtonInfo";
import { CardSurface } from "../../components/CardSurface";
import { ChipAssist } from "../../components/ChipAssist";
import { Drawer } from "../../components/Drawer";
import { Hyperlink } from "../../components/Hyperlink";
import { IconButton } from "../../components/IconButton";
import { InputSearch } from "../../components/InputSearch";
import { ProfilePicker, type Profile } from "../../components/ProfilePicker";
import { SplitButton } from "../../components/SplitButton";
import { Switch } from "../../components/Switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "../../components/Table";
import { Tag } from "../../components/Tag";
import { ToggleGroup } from "../../components/ToggleGroup";
import { Tooltip } from "../../components/Tooltip";

/**
 * Brief for extending the **Operations hub** (approvals · automations · MCP · proactive · ops chat):
 * Claude (or any LLM) is where people *think* and draft; this screen is where orgs *govern* —
 * pending publishes, tool calls, and workflows that need a human. Keep density readable; approvals first.
 */
export const PERSIAN_EXPERIENCE_PROMPT = `Persian Operations hub (Storybook):
1) Primary: Approvals queue — items from Claude MCP, in-app chat, or scheduled workflows; Approve / Reject / View.
2) MCP panel: server health, tool count, last sync — surface errors clearly.
3) Automations: named workflows with on/off — “nothing runs without policy” copy.
4) Proactive: ranked alerts (competitor, timing, policy) — dismissible in demo.
5) Ops chat: short thread for slash-style commands / escalations, not a full composer marketing demo.
6) Header KPIs: pending count, active automations, MCP status, open alerts.`;

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  body: string;
}

interface ApprovalRow {
  id: string;
  title: string;
  source: "Claude (MCP)" | "Persian" | "Workflow";
  type: string;
  requested: string;
}

type PolicyStatus = "pass" | "warn" | "fail";

interface ApprovalDetail {
  id: string;
  title: string;
  source: ApprovalRow["source"];
  type: string;
  requested: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  channels: string[];
  requestedBy: string;
  modelSession: string;
  mcpToolCallId: string;
  serverName: string;
  policyChecks: { name: string; status: PolicyStatus; detail: string }[];
  payloadPreview: string;
  auditTrail: { at: string; actor: string; action: string }[];
}

interface AutomationRow {
  id: string;
  name: string;
  enabled: boolean;
  lastRun: string;
  nextRun: string;
}

interface McpServerRow {
  id: string;
  name: string;
  version: string;
  status: "healthy" | "degraded";
  toolCount: number;
  lastSync: string;
}

interface ProactiveItem {
  id: string;
  variant: "critical" | "warning" | "positive" | "info";
  title: string;
  body: string;
}

const demoProfiles: Profile[] = [
  { id: "1", name: "Morgan Patel", initials: "MP" },
  { id: "2", name: "Riley Santos", initials: "RS" },
];

const SEED_OPS_MESSAGES: ChatMessage[] = [
  {
    id: "o0",
    role: "assistant",
    body:
      "Ops channel — I’ll surface anything that needs a human: publishes waiting on you, MCP tool calls that require approval, and policy blocks. What do you want to tackle first?",
  },
  {
    id: "o1",
    role: "user",
    body: "/queue — show me only items that came in through Claude in the last 24h.",
  },
  {
    id: "o2",
    role: "assistant",
    body:
      "You have **2** pending from **Claude (MCP)** — both are “publish_post” requests for LinkedIn. They’re at the top of the Approvals table. Want me to open the first one?",
  },
];

const INITIAL_APPROVALS: ApprovalRow[] = [
  {
    id: "a1",
    title: "Publish carousel — “Retention win” (LinkedIn)",
    source: "Claude (MCP)",
    type: "publish_post",
    requested: "8 min ago",
  },
  {
    id: "a2",
    title: "Schedule thread — 3-part POV on competitor spike",
    source: "Claude (MCP)",
    type: "schedule_batch",
    requested: "22 min ago",
  },
  {
    id: "a3",
    title: "Boost approved draft — Wed 9:45 slot",
    source: "Persian",
    type: "schedule_post",
    requested: "1 hr ago",
  },
  {
    id: "a4",
    title: "Run workflow: Metrics → draft (weekly digest)",
    source: "Workflow",
    type: "run_workflow",
    requested: "Scheduled",
  },
];

const APPROVAL_DETAILS: Record<string, ApprovalDetail> = {
  a1: {
    id: "a1",
    title: "Publish carousel — “Retention win” (LinkedIn)",
    source: "Claude (MCP)",
    type: "publish_post",
    requested: "8 min ago",
    summary:
      "Claude drafted a 5-slide carousel from your retention brief. One slide cites an external stat — policy allows it after this approval.",
    riskLevel: "medium",
    channels: ["LinkedIn Company", "Draft preview only"],
    requestedBy: "Claude session · Morgan Patel workspace",
    modelSession: "claude-opus-4 · thread msg_01K9…3f2a",
    mcpToolCallId: "tc_persian_publish_8f2c1a",
    serverName: "persian-mcp",
    policyChecks: [
      { name: "Outbound links", status: "pass", detail: "2 links (limit 2)" },
      { name: "Brand voice", status: "pass", detail: "Matches approved tone pack" },
      { name: "PII scan", status: "warn", detail: "Email domain redacted in slide 3" },
    ],
    payloadPreview: `{
  "tool": "publish_post",
  "account": "linkedin_company",
  "visibility": "PUBLIC",
  "slides": 5,
  "first_comment": "Retention ≠ discounts — here's what we learned…"
}`,
    auditTrail: [
      { at: "8 min ago", actor: "Claude (MCP)", action: "Requested publish via persian-mcp" },
      { at: "9 min ago", actor: "Policy engine", action: "Queued for human approval (medium risk)" },
      { at: "12 min ago", actor: "Morgan Patel", action: "Approved draft in Persian UI" },
    ],
  },
  a2: {
    id: "a2",
    title: "Schedule thread — 3-part POV on competitor spike",
    source: "Claude (MCP)",
    type: "schedule_batch",
    requested: "22 min ago",
    summary:
      "Three posts in a thread referencing a public competitor earnings call. Competitor name and quotes are allowed; timing is Tue–Thu next week.",
    riskLevel: "high",
    channels: ["LinkedIn", "Scheduled stagger 2h apart"],
    requestedBy: "Claude session · shared marketing pod",
    modelSession: "claude-opus-4 · thread msg_01K9…91bb",
    mcpToolCallId: "tc_persian_schedule_batch_22d901",
    serverName: "persian-mcp",
    policyChecks: [
      { name: "Competitor mention", status: "warn", detail: "Requires manager sign-off (rule C-12)" },
      { name: "Claims & citations", status: "pass", detail: "Quotes tied to transcript timestamps" },
      { name: "Rate limits", status: "pass", detail: "3 posts / 48h within cap" },
    ],
    payloadPreview: `{
  "tool": "schedule_batch",
  "posts": [
    { "order": 1, "scheduled_at": "2026-04-15T14:00:00Z" },
    { "order": 2, "scheduled_at": "2026-04-15T16:00:00Z" },
    { "order": 3, "scheduled_at": "2026-04-15T18:00:00Z" }
  ]
}`,
    auditTrail: [
      { at: "22 min ago", actor: "Claude (MCP)", action: "schedule_batch requested" },
      { at: "23 min ago", actor: "analytics-bridge", action: "Injected spike context (degraded sync)" },
    ],
  },
  a3: {
    id: "a3",
    title: "Boost approved draft — Wed 9:45 slot",
    source: "Persian",
    type: "schedule_post",
    requested: "1 hr ago",
    summary:
      "Organic post already approved; this request adds paid boost budget and audience preset “B2B SaaS founders EU”.",
    riskLevel: "low",
    channels: ["LinkedIn Boost", "EU · English"],
    requestedBy: "Riley Santos · Persian web",
    modelSession: "— (in-app, no Claude thread)",
    mcpToolCallId: "—",
    serverName: "—",
    policyChecks: [
      { name: "Spend cap", status: "pass", detail: "€120 under weekly cap €500" },
      { name: "Audience", status: "pass", detail: "Preset matches brand guidelines" },
    ],
    payloadPreview: `{
  "tool": "schedule_post",
  "boost": true,
  "budget_eur": 120,
  "slot": "2026-04-16T09:45:00+02:00"
}`,
    auditTrail: [
      { at: "1 hr ago", actor: "Riley Santos", action: "Submitted boost from composer" },
      { at: "1 hr ago", actor: "Policy", action: "Auto-routed to approvals (paid)" },
    ],
  },
  a4: {
    id: "a4",
    title: "Run workflow: Metrics → draft (weekly digest)",
    source: "Workflow",
    type: "run_workflow",
    requested: "Scheduled",
    summary:
      "Weekly automation pulls metrics from analytics-bridge and drafts a digest for LinkedIn. Run is idempotent; last run succeeded.",
    riskLevel: "low",
    channels: ["Workflow output → Approvals queue"],
    requestedBy: "Automation · Metrics → draft",
    modelSession: "claude-sonnet · headless worker",
    mcpToolCallId: "wf_run_2026_w16_metrics",
    serverName: "workflow-runner",
    policyChecks: [
      { name: "Workflow policy", status: "pass", detail: "Allowed window Mon 08:00" },
      { name: "Data residency", status: "pass", detail: "EU aggregate only" },
    ],
    payloadPreview: `{
  "workflow_id": "metrics_to_draft_weekly",
  "trigger": "cron",
  "dry_run": false
}`,
    auditTrail: [
      { at: "Scheduled", actor: "Cron", action: "Trigger armed for Mon 08:00" },
      { at: "Last week", actor: "Workflow", action: "Published digest after approval" },
    ],
  },
};

const INITIAL_AUTOMATIONS: AutomationRow[] = [
  { id: "m1", name: "Metrics → draft", enabled: true, lastRun: "Mon 08:02", nextRun: "Mon 08:00" },
  { id: "m2", name: "Alert → counter-post", enabled: true, lastRun: "2 hr ago", nextRun: "On trigger" },
  { id: "m3", name: "Cross-post to X (mirror LinkedIn)", enabled: false, lastRun: "—", nextRun: "—" },
];

const MCP_SERVERS: McpServerRow[] = [
  { id: "s1", name: "persian-mcp", version: "1.4.2", status: "healthy", toolCount: 8, lastSync: "12s ago" },
  { id: "s2", name: "analytics-bridge", version: "0.9.1", status: "degraded", toolCount: 3, lastSync: "6m ago" },
];

const INITIAL_PROACTIVE: ProactiveItem[] = [
  {
    id: "p1",
    variant: "critical",
    title: "Policy: outbound link limit",
    body: "Claude requested a post with 4 external links — brand policy allows 2. Held for approval.",
  },
  {
    id: "p2",
    variant: "warning",
    title: "Connector: analytics-bridge",
    body: "Sync slower than 99th percentile — batches may delay approval SLAs by ~2 min.",
  },
  {
    id: "p3",
    variant: "positive",
    title: "Window opportunity",
    body: "Educational carousels trending up 22% WoW — consider approving the queued digest draft.",
  },
];

const IconSpark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M5 20l.5-2M19 20l-.5-2M4 14h2M18 14h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M10 3a4 4 0 00-4 4v2.5L5 14h10l-1-4.5V7a4 4 0 00-4-4zM8 14a2 2 0 004 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M18 2L9 11M18 2l-6 16-2-7-7-2L18 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function sourceBadgeVariant(src: ApprovalRow["source"]): "discovery" | "brand" | "positive" {
  if (src === "Claude (MCP)") return "discovery";
  if (src === "Persian") return "brand";
  return "positive";
}

function riskTagVariant(level: ApprovalDetail["riskLevel"]): "positive" | "warning" | "critical" {
  if (level === "low") return "positive";
  if (level === "medium") return "warning";
  return "critical";
}

function policyBadgeVariant(s: PolicyStatus): "positive" | "warning" | "critical" {
  if (s === "pass") return "positive";
  if (s === "warn") return "warning";
  return "critical";
}

function policyLabel(s: PolicyStatus): string {
  if (s === "pass") return "Pass";
  if (s === "warn") return "Review";
  return "Block";
}

function proactiveBadgeVariant(
  v: ProactiveItem["variant"]
): "negative" | "warning" | "positive" | "discovery" {
  switch (v) {
    case "critical":
      return "negative";
    case "warning":
      return "warning";
    case "positive":
      return "positive";
    case "info":
      return "discovery";
  }
}

function proactiveAccentBorder(v: ProactiveItem["variant"]): string {
  switch (v) {
    case "critical":
      return "var(--hs-color-border-critical)";
    case "warning":
      return "var(--hs-color-border-warning)";
    case "positive":
      return "var(--hs-color-border-positive)";
    case "info":
      return "var(--hs-color-border-info)";
  }
}

function proactiveKindLabel(v: ProactiveItem["variant"]): string {
  switch (v) {
    case "critical":
      return "Policy";
    case "warning":
      return "Connector";
    case "positive":
      return "Opportunity";
    case "info":
      return "Signal";
  }
}

export interface PersianJourneyProps {
  productName?: string;
}

/**
 * **Persian Operations hub** — dashboard for approvals, MCP health, automations, proactive signals,
 * and a compact **ops chat** (Claude users plan in the LLM; this is where governance and automation meet).
 */
export function PersianJourney({ productName = "Persian" }: PersianJourneyProps) {
  const [approvals, setApprovals] = useState<ApprovalRow[]>(INITIAL_APPROVALS);
  const [automations, setAutomations] = useState<AutomationRow[]>(INITIAL_AUTOMATIONS);
  const [proactive, setProactive] = useState<ProactiveItem[]>(INITIAL_PROACTIVE);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_OPS_MESSAGES);
  const [composer, setComposer] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [sourceTab, setSourceTab] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);

  const selectedDetail = useMemo(
    () => (selectedApprovalId ? APPROVAL_DETAILS[selectedApprovalId] ?? null : null),
    [selectedApprovalId]
  );

  useEffect(() => {
    if (!selectedApprovalId) return;
    if (!approvals.some((a) => a.id === selectedApprovalId)) {
      setDetailOpen(false);
      setSelectedApprovalId(null);
    }
  }, [approvals, selectedApprovalId]);

  const pendingCount = approvals.length;
  const activeAuto = automations.filter((a) => a.enabled).length;
  const mcpOk = MCP_SERVERS.every((s) => s.status === "healthy");
  const alertCount = proactive.length;

  const filteredApprovals = useMemo(() => {
    let rows = approvals;
    if (sourceTab === "claude") rows = rows.filter((a) => a.source === "Claude (MCP)");
    else if (sourceTab === "persian") rows = rows.filter((a) => a.source === "Persian");
    else if (sourceTab === "workflow") rows = rows.filter((a) => a.source === "Workflow");
    const q = approvalFilter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
    );
  }, [approvals, approvalFilter, sourceTab]);

  const appendMessage = useCallback((role: ChatRole, body: string) => {
    setMessages((prev) => [...prev, { id: `m-${Date.now()}`, role, body }]);
  }, []);

  const sendChat = useCallback(() => {
    const t = composer.trim();
    if (!t) return;
    appendMessage("user", t);
    setComposer("");
    setTimeout(() => {
      appendMessage(
        "assistant",
        "Logged. In production this would route to your policy engine and refresh the Approvals table. (Demo stub.)"
      );
    }, 400);
  }, [composer, appendMessage]);

  const approve = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  const reject = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedApprovalId(null);
  };

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const dismissProactive = (id: string) => {
    setProactive((prev) => prev.filter((p) => p.id !== id));
  };

  const injectQuick = (text: string) => setComposer((c) => (c ? `${c} ${text}` : text));

  return (
    <div
      className="flex min-h-screen flex-col text-[color:var(--hs-color-text-base)]"
      style={{ fontFamily: HS_FONT_FAMILY }}
    >
      <header
        className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6"
        style={{
          borderColor: "var(--hs-color-border-subtle)",
          background: "var(--hs-color-fill-app)",
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--hs-radii-2)] bg-hs-comp-button-filled-bg text-hs-text-on-filled">
            <IconSpark />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-hs-strong-medium leading-tight">{productName}</span>
              <Badge variant="discovery" size="small">
                Operations
              </Badge>
            </div>
            <p className="truncate text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
              Approvals · MCP · automations · proactive
            </p>
          </div>
        </div>
        <div className="hidden max-w-sm flex-1 md:block">
          <InputSearch
            placeholder="Search approvals, tools, workflows…"
            aria-label="Search hub"
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip content="Hub notifications" position="bottom">
            <IconButton icon={<IconBell />} aria-label="Notifications" variant="ghost" size="small" />
          </Tooltip>
          <div className="ml-1 border-l pl-2" style={{ borderColor: "var(--hs-color-border-subtle)" }}>
            <ProfilePicker profiles={demoProfiles} selected={["1"]} maxVisible={2} onAdd={() => {}} onManage={() => {}} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[color:var(--hs-color-text-base)] md:text-3xl">
            Operations hub
          </h1>
          <p className="mt-2 max-w-3xl text-hs-base-medium text-[color:var(--hs-color-text-subtle)]">
            Your team can plan and draft in <strong className="font-semibold text-[color:var(--hs-color-text-base)]">Claude</strong> (or any
            LLM) — this is the control room for what still needs a <strong className="font-semibold text-[color:var(--hs-color-text-base)]">human</strong>:
            publishes, MCP tool calls, and automations under policy.
          </p>
        </div>

        {/* KPI strip */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-hs-base-small font-semibold uppercase tracking-wide text-[color:var(--hs-color-text-subtle)]">
            Snapshot
          </span>
          <ButtonInfo
            title="Operations snapshot"
            content="Counts refresh when you approve or reject items, toggle automations, or dismiss proactive signals. MCP health reflects connector sync."
          />
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CardSurface variant="raised" padding="medium" className="border border-[var(--hs-color-border-subtle)]">
            <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">Pending approvals</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--hs-color-text-base)]">{pendingCount}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={pendingCount > 0 ? "warning" : "positive"} size="small">
                {pendingCount > 0 ? "Action needed" : "Inbox clear"}
              </Badge>
              {pendingCount > 0 && (
                <Tag variant="info" size="small">
                  Human-in-the-loop
                </Tag>
              )}
            </div>
          </CardSurface>
          <CardSurface variant="raised" padding="medium" className="border border-[var(--hs-color-border-subtle)]">
            <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">Automations on</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--hs-color-text-base)]">{activeAuto}</p>
            <p className="mt-2 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">of {automations.length} configured</p>
            <Tag variant="default" size="small" className="mt-3">
              Policy-gated runs
            </Tag>
          </CardSurface>
          <CardSurface variant="raised" padding="medium" className="border border-[var(--hs-color-border-subtle)]">
            <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">MCP servers</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--hs-color-text-base)]">
              {MCP_SERVERS.filter((s) => s.status === "healthy").length}/{MCP_SERVERS.length}
            </p>
            <div className="mt-3">
              <Badge variant={mcpOk ? "positive" : "warning"} size="small">
                {mcpOk ? "All healthy" : "Check connectors"}
              </Badge>
            </div>
          </CardSurface>
          <CardSurface variant="raised" padding="medium" className="border border-[var(--hs-color-border-subtle)]">
            <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">Proactive items</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--hs-color-text-base)]">{alertCount}</p>
            <p className="mt-2 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">Signals & policy</p>
            <Tag variant="discovery" size="small" className="mt-3">
              Ranked by impact
            </Tag>
          </CardSurface>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Approvals — primary column */}
          <div className="lg:col-span-7">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-[color:var(--hs-color-text-base)]">Approvals queue</h2>
                  <ButtonInfo
                    title="Approvals queue"
                    content="Each row is a gated action: publish, schedule, boost, or workflow run. Open View for payload, policy, MCP lineage, and audit before you approve."
                  />
                </div>
                <p className="mt-1 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                  From Claude via MCP, in-app, or scheduled workflows — nothing publishes without you here (unless policy says otherwise).
                </p>
              </div>
              <ToggleGroup
                size="small"
                value={sourceTab}
                onChange={(v) => setSourceTab(typeof v === "string" ? v : v[0] ?? "all")}
                className="max-w-full shrink-0 overflow-x-auto"
                items={[
                  { value: "all", label: "All" },
                  { value: "claude", label: "Claude" },
                  { value: "persian", label: "In-app" },
                  { value: "workflow", label: "Workflow" },
                ]}
              />
            </div>
            <CardSurface variant="raised" padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHead>What</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-12 text-center text-[color:var(--hs-color-text-subtle)]">
                          No rows match — inbox empty or filter too tight.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApprovals.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="max-w-[280px] font-medium text-[color:var(--hs-color-text-base)]">
                            {row.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant={sourceBadgeVariant(row.source)} size="small">
                              {row.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-[13px] text-[color:var(--hs-color-text-subtle)]">
                            {row.type}
                          </TableCell>
                          <TableCell className="text-[color:var(--hs-color-text-subtle)]">{row.requested}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap justify-end gap-2">
                              <Button
                                variant="ghost"
                                className="!min-h-0 py-1.5 text-hs-button-small"
                                type="button"
                                onClick={() => {
                                  setSelectedApprovalId(row.id);
                                  setDetailOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="outlined"
                                className="!min-h-0 py-1.5 text-hs-button-small"
                                type="button"
                                onClick={() => reject(row.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="primary"
                                className="!min-h-0 py-1.5 text-hs-button-small"
                                type="button"
                                onClick={() => approve(row.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardSurface>
            <p className="mt-3 text-hs-base-small text-[color:var(--hs-color-text-subtle)] md:hidden">
              Tip: use search in the header on larger screens to filter this table.
            </p>
          </div>

          {/* Right stack */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <CardSurface
              variant="flat"
              padding="medium"
              header={
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-hs-strong-medium">MCP & connectors</span>
                  <Tooltip content="Tool IDs match approval rows and audit trail" position="left">
                    <Tag variant="info" size="small">
                      Tool registry
                    </Tag>
                  </Tooltip>
                </div>
              }
            >
              <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                Servers that expose tools to Claude — same tool IDs you approve in the queue above.
              </p>
              <ul className="mt-4 space-y-3">
                {MCP_SERVERS.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--hs-radii-2)] border p-3"
                    style={{ borderColor: "var(--hs-color-border-subtle)" }}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[color:var(--hs-color-text-base)]">{s.name}</p>
                        <Tag variant="brand" size="small">
                          v{s.version}
                        </Tag>
                      </div>
                      <p className="mt-1 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                        {s.toolCount} tools · sync {s.lastSync}
                      </p>
                    </div>
                    <Badge variant={s.status === "healthy" ? "positive" : "warning"} size="small">
                      {s.status}
                    </Badge>
                  </li>
                ))}
              </ul>
              <Hyperlink href="#" size="small" className="mt-4 inline-block">
                Open MCP manifest (demo)
              </Hyperlink>
            </CardSurface>

            <CardSurface
              variant="flat"
              padding="none"
              className="overflow-hidden"
              header={
                <div>
                  <h2 className="text-hs-strong-medium text-[color:var(--hs-color-text-base)]">Proactive</h2>
                  <p className="mt-1 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                    Ranked signals for your queue — a feed you can scan and dismiss when handled (not toast-style alerts).
                  </p>
                </div>
              }
            >
              {proactive.length === 0 ? (
                <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">All caught up.</p>
              ) : (
                <ul
                  className="max-h-[340px] divide-y overflow-y-auto"
                  style={{ borderColor: "var(--hs-color-border-subtle)" }}
                >
                  {proactive.map((p) => (
                    <li key={p.id} className="flex gap-1 py-4">
                      <div
                        className="min-w-0 flex-1 border-l-4 pl-3"
                        style={{ borderColor: proactiveAccentBorder(p.variant) }}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={proactiveBadgeVariant(p.variant)} size="small">
                            {proactiveKindLabel(p.variant)}
                          </Badge>
                          <span className="text-hs-strong-medium text-[color:var(--hs-color-text-base)]">{p.title}</span>
                        </div>
                        <p className="mt-1.5 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">{p.body}</p>
                      </div>
                      <IconButton
                        icon={<IconClose />}
                        variant="ghost"
                        size="small"
                        aria-label={`Dismiss: ${p.title}`}
                        type="button"
                        className="shrink-0 self-start"
                        onClick={() => dismissProactive(p.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </CardSurface>

            <CardSurface variant="interactive" padding="medium">
              <h2 className="text-hs-strong-medium">Automations</h2>
              <p className="mt-1 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                When off, triggers still log — they won’t execute until re-enabled.
              </p>
              <ul className="mt-4 space-y-4">
                {automations.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 last:border-0 last:pb-0"
                    style={{ borderColor: "var(--hs-color-border-subtle)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[color:var(--hs-color-text-base)]">{a.name}</p>
                      <p className="mt-1 text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                        Last: {a.lastRun} · Next: {a.nextRun}
                      </p>
                    </div>
                    <Switch
                      checked={a.enabled}
                      onChange={() => toggleAutomation(a.id)}
                      aria-label={`Toggle ${a.name}`}
                    />
                  </li>
                ))}
              </ul>
            </CardSurface>
          </div>
        </div>

        {/* Ops chat — automation + escalation */}
        <section className="mt-10" aria-label="Operations chat">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[color:var(--hs-color-text-base)]">Ops chat</h2>
              <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
                Short commands and escalations — not a replacement for planning in Claude; this ties back to the queue.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ChipAssist onClick={() => injectQuick("/queue claude")}>/queue claude</ChipAssist>
              <ChipAssist onClick={() => injectQuick("/policy links")}>/policy links</ChipAssist>
              <ChipAssist onClick={() => injectQuick("/mcp status")}>/mcp status</ChipAssist>
            </div>
          </div>
          <CardSurface variant="raised" className="flex max-h-[420px] flex-col overflow-hidden p-0" padding="none">
            <div
              className="min-h-[180px] flex-1 space-y-3 overflow-y-auto px-4 py-4"
              role="log"
              aria-live="polite"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[min(100%,560px)] whitespace-pre-wrap rounded-[var(--hs-radii-2)] bg-hs-comp-button-filled-bg px-4 py-2.5 text-hs-base-small text-hs-text-on-filled"
                        : "max-w-[min(100%,560px)] whitespace-pre-wrap rounded-[var(--hs-radii-2)] bg-[var(--hs-comp-badge-neutral-bg)] px-4 py-2.5 text-hs-base-small text-[color:var(--hs-color-text-base)]"
                    }
                  >
                    {m.body}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3" style={{ borderColor: "var(--hs-color-border-subtle)" }}>
              <textarea
                rows={2}
                placeholder="e.g. /queue, /escalate, or ask for a summary of pending MCP items…"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                className="mb-2 w-full resize-y rounded-[var(--hs-radii-2)] border border-[color:var(--hs-color-border-subtle)] bg-[var(--hs-color-fill-app)] px-3 py-2 text-hs-base-small text-[color:var(--hs-color-text-base)] outline-none focus:border-[color:var(--hs-comp-button-filled-bg)]"
                aria-label="Ops message"
              />
              <div className="flex justify-end">
                <Button type="button" onClick={sendChat} disabled={!composer.trim()}>
                  <span className="inline-flex items-center gap-2">
                    Send
                    <IconSend />
                  </span>
                </Button>
              </div>
            </div>
          </CardSurface>
        </section>

        <p className="mt-8 text-center text-hs-base-small text-[color:var(--hs-color-text-subtle)]">
          Builder brief: <code className="rounded bg-[var(--hs-color-fill-base)] px-1 font-mono text-[13px]">PERSIAN_EXPERIENCE_PROMPT</code>
        </p>
      </main>

      <Drawer
        open={detailOpen}
        onClose={closeDetail}
        width="min(560px, 100vw)"
        header={
          selectedDetail ? (
            <div className="min-w-0 pr-2">
              <span className="line-clamp-2 text-hs-strong-medium">{selectedDetail.title}</span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={sourceBadgeVariant(selectedDetail.source)} size="small">
                  {selectedDetail.source}
                </Badge>
                <Tag variant={riskTagVariant(selectedDetail.riskLevel)} size="small">
                  {selectedDetail.riskLevel === "low"
                    ? "Low risk"
                    : selectedDetail.riskLevel === "medium"
                      ? "Medium risk"
                      : "High risk"}
                </Tag>
                <span className="font-mono text-[12px] text-[color:var(--hs-color-text-subtle)]">{selectedDetail.type}</span>
              </div>
            </div>
          ) : (
            <span className="text-hs-strong-medium">Approval detail</span>
          )
        }
        footer={
          selectedDetail ? (
            <div className="flex w-full flex-wrap items-center justify-end gap-2">
              <Button variant="ghost" type="button" onClick={closeDetail}>
                Close
              </Button>
              <ActionBar className="flex-wrap justify-end">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    reject(selectedDetail.id);
                    closeDetail();
                  }}
                >
                  Reject
                </Button>
                <ActionBarDivider />
                <SplitButton
                  label="Approve"
                  variant="filled"
                  onAction={() => {
                    approve(selectedDetail.id);
                    closeDetail();
                  }}
                  items={[
                    { label: "Approve & schedule next", value: "schedule" },
                    { label: "Approve with audit note", value: "note" },
                  ]}
                  onSelect={(value) => {
                    approve(selectedDetail.id);
                    closeDetail();
                    appendMessage("assistant", `Recorded: ${value === "schedule" ? "Approve & schedule next" : "Approve with audit note"} (demo).`);
                  }}
                />
              </ActionBar>
            </div>
          ) : null
        }
      >
        {selectedDetail ? (
          <div className="space-y-4">
            <p className="text-hs-base-medium text-[color:var(--hs-color-text-base)]">{selectedDetail.summary}</p>
            <dl className="grid grid-cols-1 gap-3 rounded-[var(--hs-radii-2)] border border-[var(--hs-color-border-subtle)] bg-[var(--hs-color-fill-base)] p-4 text-hs-base-small sm:grid-cols-2">
              <div>
                <dt className="text-[color:var(--hs-color-text-subtle)]">Requested</dt>
                <dd className="mt-0.5 font-medium text-[color:var(--hs-color-text-base)]">{selectedDetail.requested}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--hs-color-text-subtle)]">Requested by</dt>
                <dd className="mt-0.5 font-medium text-[color:var(--hs-color-text-base)]">{selectedDetail.requestedBy}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[color:var(--hs-color-text-subtle)]">Channels</dt>
                <dd className="mt-1.5 flex flex-wrap gap-2">
                  {selectedDetail.channels.map((ch) => (
                    <Tag key={ch} variant="discovery" size="small">
                      {ch}
                    </Tag>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-[color:var(--hs-color-text-subtle)]">Model / session</dt>
                <dd className="mt-0.5 break-all font-mono text-[13px] text-[color:var(--hs-color-text-base)]">
                  {selectedDetail.modelSession}
                </dd>
              </div>
              <div>
                <dt className="text-[color:var(--hs-color-text-subtle)]">MCP server</dt>
                <dd className="mt-0.5 font-mono text-[13px] text-[color:var(--hs-color-text-base)]">{selectedDetail.serverName}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[color:var(--hs-color-text-subtle)]">tool_call_id</dt>
                <dd className="mt-0.5 break-all font-mono text-[13px] text-[color:var(--hs-color-text-base)]">
                  {selectedDetail.mcpToolCallId}
                </dd>
              </div>
            </dl>

            <CardSurface variant="flat" padding="medium" header={<span className="text-hs-strong-medium">Policy checks</span>}>
              <ul className="space-y-2">
                {selectedDetail.policyChecks.map((c) => (
                  <li
                    key={c.name}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-[var(--hs-radii-2)] border border-[var(--hs-color-border-subtle)] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[color:var(--hs-color-text-base)]">{c.name}</p>
                      <p className="text-hs-base-small text-[color:var(--hs-color-text-subtle)]">{c.detail}</p>
                    </div>
                    <Badge variant={policyBadgeVariant(c.status)} size="small">
                      {policyLabel(c.status)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardSurface>

            <CardSurface variant="flat" padding="medium" header={<span className="text-hs-strong-medium">Payload preview</span>}>
              <pre className="max-h-[220px] overflow-auto whitespace-pre-wrap break-words rounded-[var(--hs-radii-2)] bg-[var(--hs-color-fill-base)] p-3 font-mono text-[12px] text-[color:var(--hs-color-text-base)]">
                {selectedDetail.payloadPreview}
              </pre>
            </CardSurface>

            <CardSurface variant="flat" padding="medium" header={<span className="text-hs-strong-medium">Audit trail</span>}>
              <ol className="list-decimal space-y-2 pl-5 text-hs-base-small text-[color:var(--hs-color-text-base)]">
                {selectedDetail.auditTrail.map((step, i) => (
                  <li key={`${step.at}-${i}`}>
                    <span className="text-[color:var(--hs-color-text-subtle)]">{step.at}</span> — <strong>{step.actor}</strong>: {step.action}
                  </li>
                ))}
              </ol>
            </CardSurface>

            <Alert variant="info" title="Compliance">
              Store <code className="rounded bg-[var(--hs-color-fill-base)] px-1 font-mono text-[12px]">tool_call_id</code> with model session
              and approver identity for every decision — this drawer mirrors what auditors export.
            </Alert>
          </div>
        ) : (
          <p className="text-hs-base-medium text-[color:var(--hs-color-text-subtle)]">Loading…</p>
        )}
      </Drawer>
    </div>
  );
}
