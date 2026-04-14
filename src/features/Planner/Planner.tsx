import { useCallback, useState } from "react";
import { cn } from "../../lib/cn";
import { ProductNav } from "../shared/NavIcons";
import { ActionBar, ActionBarDivider } from "../../components/ActionBar";
import { Alert } from "../../components/Alert";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { ButtonChoice } from "../../components/ButtonChoice";
import { ButtonInfo } from "../../components/ButtonInfo";
import { CardSurface } from "../../components/CardSurface";
import { Checkbox } from "../../components/Checkbox";
import { ChipAssist } from "../../components/ChipAssist";
import { ChipFilter } from "../../components/ChipFilter";
import { Combobox } from "../../components/Combobox";
import { Hyperlink } from "../../components/Hyperlink";
import { IconButton, IconButtonToggleable } from "../../components/IconButton";
import { InlineDropdown } from "../../components/InlineDropdown";
import { Input } from "../../components/Input";
import { InputSearch } from "../../components/InputSearch";
import { Media } from "../../components/Media";
import { MenuButton } from "../../components/MenuButton";
import { ProfilePicker, type Profile } from "../../components/ProfilePicker";
import { Radio, RadioGroup } from "../../components/Radio";
import { Select } from "../../components/Select";
import { SplitButton } from "../../components/SplitButton";
import { Switch } from "../../components/Switch";
import { Tag } from "../../components/Tag";
import { ToggleGroup } from "../../components/ToggleGroup";
import { Tooltip } from "../../components/Tooltip";
import { Tree, type TreeNode } from "../../components/Tree";
import { HS_FONT_FAMILY } from "../../lib/hs-font-family";

/** Consistent spacing between planner sections (matches HS-Bento rhythm). */
const GAP = 24;

const WEEK_DAYS = [
  { key: "mon", label: "Mon", date: "7" },
  { key: "tue", label: "Tue", date: "8" },
  { key: "wed", label: "Wed", date: "9" },
  { key: "thu", label: "Thu", date: "10" },
  { key: "fri", label: "Fri", date: "11" },
  { key: "sat", label: "Sat", date: "12" },
  { key: "sun", label: "Sun", date: "13" },
];

const PROFILES: Profile[] = [
  { id: "1", name: "Alex Kim", initials: "AK" },
  { id: "2", name: "Jordan Lee", initials: "JL" },
  { id: "3", name: "Sam Rivera", initials: "SR" },
  { id: "4", name: "Taylor Chen", initials: "TC" },
];

const CAMPAIGN_TREE: TreeNode[] = [
  {
    id: "q2",
    label: "Q2 Launch",
    children: [
      { id: "q2-social", label: "Social" },
      { id: "q2-email", label: "Email" },
    ],
  },
  {
    id: "always",
    label: "Always-on",
    children: [{ id: "a-edu", label: "Education" }],
  },
];

export function Planner() {
  const [navHint, setNavHint] = useState<string | null>(null);
  const [view, setView] = useState("week");
  const [filterAll, setFilterAll] = useState(true);
  const [filterDrafts, setFilterDrafts] = useState(false);
  const [filterScheduled, setFilterScheduled] = useState(false);
  const [selectedDay, setSelectedDay] = useState("wed");
  const [pillars, setPillars] = useState<string[]>(["awareness", "product"]);
  const [topic, setTopic] = useState("webinar");
  const [emailDigest, setEmailDigest] = useState(true);
  const [priority, setPriority] = useState("balanced");
  const [assignees, setAssignees] = useState<string[]>(["1", "2"]);
  const [treeSel, setTreeSel] = useState(() => new Set<string>(["q2-social", "a-edu"]));
  const [tasks, setTasks] = useState({
    a: true,
    b: false,
    c: true,
  });
  const [notes, setNotes] = useState("");

  const onNav = useCallback((label: string) => {
    setNavHint(label);
    setTimeout(() => setNavHint(null), 2000);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "var(--hs-color-fill-subtle)",
        fontFamily: HS_FONT_FAMILY,
      }}
    >
      <ProductNav activeItem="Plan" onItemClick={onNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <header
          style={{
            flexShrink: 0,
            padding: "20px 24px",
            background: "var(--hs-color-fill-app)",
            borderBottom: "1px solid var(--hs-color-border-subtle)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: "32px",
                fontWeight: 700,
                color: "var(--hs-color-text-base)",
              }}
            >
              Content planner
            </h1>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: "var(--hs-color-text-subtle)", maxWidth: 560 }}>
              Example layout for scheduling and reviews — HS-Bento components with a 24px gap between planner blocks.
            </p>
            {navHint && (
              <span style={{ fontSize: 12, color: "var(--hs-color-text-link)" }} role="status">
                Nav: {navHint}
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <InlineDropdown
              aria-label="Workspace"
              options={[
                { value: "hs", label: "Hootsuite Marketing" },
                { value: "brand", label: "Brand workspace" },
              ]}
              defaultValue="hs"
            />
            <Tooltip
              content="Open calendar settings"
              position="bottom"
            >
              <IconButton
                aria-label="Calendar settings"
                variant="outlined"
                size="medium"
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
            </Tooltip>
            <MenuButton
              variant="secondary"
              items={[
                { label: "Export CSV", value: "csv" },
                { label: "Export PDF", value: "pdf" },
              ]}
              onSelect={() => undefined}
            >
              Export
            </MenuButton>
            <SplitButton
              label="Schedule"
              variant="filled"
              onAction={() => undefined}
              items={[
                { label: "Schedule + duplicate", value: "dup" },
                { label: "Schedule as draft", value: "draft" },
              ]}
              onSelect={() => undefined}
            />
          </div>
        </header>

        {/* Scrollable planner body */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: GAP,
          }}
        >
          {/* Toolbar: search, filters, assist */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ flex: "1 1 280px", minWidth: 200, maxWidth: 420 }}>
              <InputSearch placeholder="Search posts, owners, or tags…" />
            </div>
            <Select
              label="Channel"
              size="small"
              options={[
                { value: "all", label: "All channels" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "instagram", label: "Instagram" },
              ]}
              defaultValue="all"
              className="min-w-[180px]"
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <ChipFilter selected={filterAll} onSelectedChange={setFilterAll}>
                All
              </ChipFilter>
              <ChipFilter selected={filterDrafts} onSelectedChange={setFilterDrafts}>
                Drafts
              </ChipFilter>
              <ChipFilter selected={filterScheduled} onSelectedChange={setFilterScheduled}>
                Scheduled
              </ChipFilter>
            </div>
            <ChipAssist
              leadingIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l1.2 3.2L12.5 6 9.2 7.2 8 10.5 6.8 7.2 3.5 6l3.3-.8L8 2z" fill="currentColor" />
                </svg>
              }
            >
              AI suggestions
            </ChipAssist>
          </div>

          {/* View mode + content pillars */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--hs-color-text-subtle)", letterSpacing: "0.02em" }}>
                View
              </span>
              <ToggleGroup
                size="medium"
                value={view}
                onChange={(v) => setView(typeof v === "string" ? v : v[0])}
                items={[
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                  { value: "agenda", label: "Agenda" },
                ]}
              />
            </div>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--hs-color-text-subtle)", letterSpacing: "0.02em", display: "block", marginBottom: 8 }}>
                Content pillars
              </span>
              <ButtonChoice
                columns={3}
                value={pillars}
                onChange={setPillars}
                items={[
                  { value: "awareness", label: "Awareness" },
                  { value: "product", label: "Product" },
                  { value: "community", label: "Community" },
                  { value: "employer", label: "Employer brand" },
                ]}
              />
            </div>
          </div>

          {/* Main grid: schedule + sidebar */}
          <div
            className={cn(
              "grid w-full items-start",
              "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]"
            )}
            style={{ gap: GAP }}
          >
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
              <CardSurface
                variant="raised"
                header={
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--hs-color-text-base)" }}>Week of Apr 7–13, 2026</span>
                    <ButtonInfo
                      title="Week strip"
                      content="Select a day to filter the list below. This block uses CardSurface, Button, and ChipFilter patterns."
                    />
                  </div>
                }
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {WEEK_DAYS.map((d) => {
                    const active = selectedDay === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setSelectedDay(d.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 56,
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: active ? "2px solid var(--hs-comp-button-filled-bg)" : "1px solid var(--hs-color-border-subtle)",
                          background: active ? "var(--hs-comp-button-filled-bg)" : "var(--hs-color-fill-app)",
                          color: active ? "var(--hs-comp-button-filled-text)" : "var(--hs-color-text-base)",
                          cursor: "pointer",
                          fontFamily: HS_FONT_FAMILY,
                        }}
                      >
                        <span style={{ fontSize: 12, lineHeight: "16px", opacity: 0.85 }}>{d.label}</span>
                        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "24px" }}>{d.date}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge variant="brand" size="small">
                    {view} view
                  </Badge>
                  <Badge variant="positive" size="small">
                    {selectedDay} selected
                  </Badge>
                  <Button variant="ghost" className="!px-2 !py-1 !min-w-0 !text-[14px]">
                    Clear selection
                  </Button>
                </div>
              </CardSurface>

              <CardSurface
                variant="flat"
                header={
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--hs-color-text-base)" }}>Scheduled posts</span>
                    <Button variant="outlined" className="!py-2 !px-3 !text-[14px]">
                      Add slot
                    </Button>
                  </div>
                }
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    {
                      id: "a" as const,
                      time: "09:00",
                      title: "Product tip — carousel",
                      tag: "Education",
                      badge: "Scheduled",
                      tagVariant: "info" as const,
                      badgeVariant: "positive" as const,
                    },
                    {
                      id: "b" as const,
                      time: "12:30",
                      title: "Customer story clip",
                      tag: "Social proof",
                      badge: "Draft",
                      tagVariant: "discovery" as const,
                      badgeVariant: "warning" as const,
                    },
                    {
                      id: "c" as const,
                      time: "16:00",
                      title: "Webinar promo",
                      tag: "Webinar",
                      badge: "Needs review",
                      tagVariant: "warning" as const,
                      badgeVariant: "negative" as const,
                    },
                  ].map((row) => (
                    <div
                      key={row.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid var(--hs-color-border-subtle)",
                        background: "var(--hs-color-fill-app)",
                      }}
                    >
                      <Checkbox
                        checked={tasks[row.id]}
                        onChange={() =>
                          setTasks((t) => ({ ...t, [row.id]: !t[row.id] }))
                        }
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "var(--hs-color-text-subtle)", marginBottom: 4 }}>{row.time}</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--hs-color-text-base)", marginBottom: 8 }}>{row.title}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <Tag variant={row.tagVariant} size="small">
                            {row.tag}
                          </Tag>
                          <Badge variant={row.badgeVariant} size="small">
                            {row.badge}
                          </Badge>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Media ratio="16:9" rounded="small" className="w-[96px] shrink-0">
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(135deg, var(--hs-comp-alert-info-bg) 0%, var(--hs-comp-alert-discovery-bg) 100%)",
                            }}
                          />
                        </Media>
                        <IconButtonToggleable
                          aria-label="Star post"
                          variant="ghost"
                          size="small"
                          pressed={row.id === "a"}
                          icon={
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path
                                d="M9 2l2 4.5 5 .5-3.8 3.5 1 5L9 13.5 3.3 15.5l1-5L.5 7 5.5 6.5 9 2z"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                              />
                            </svg>
                          }
                          iconOn={
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path
                                d="M9 2l2 4.5 5 .5-3.8 3.5 1 5L9 13.5 3.3 15.5l1-5L.5 7 5.5 6.5 9 2z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                              />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardSurface>

              <CardSurface variant="flat" header={<span style={{ fontSize: 16, fontWeight: 700, color: "var(--hs-color-text-base)" }}>Campaigns</span>}>
                <Tree nodes={CAMPAIGN_TREE} selected={treeSel} onChange={setTreeSel} />
              </CardSurface>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
              <CardSurface
                variant="raised"
                header={<span style={{ fontSize: 16, fontWeight: 700, color: "var(--hs-color-text-base)" }}>Plan settings</span>}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Alert variant="info" title="Tip">
                    Use filters above to narrow drafts. Assignees and priority apply to new slots.
                  </Alert>
                  <Switch checked={emailDigest} onChange={(e) => setEmailDigest(e.target.checked)} label="Weekly email digest" />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", display: "block", marginBottom: 8 }}>
                      Publishing priority
                    </span>
                    <RadioGroup name="planner-priority" orientation="vertical">
                      <Radio
                        name="planner-priority"
                        value="reach"
                        label="Max reach"
                        checked={priority === "reach"}
                        onChange={() => setPriority("reach")}
                      />
                      <Radio
                        name="planner-priority"
                        value="balanced"
                        label="Balanced"
                        checked={priority === "balanced"}
                        onChange={() => setPriority("balanced")}
                      />
                      <Radio
                        name="planner-priority"
                        value="quality"
                        label="Quality first"
                        checked={priority === "quality"}
                        onChange={() => setPriority("quality")}
                      />
                    </RadioGroup>
                  </div>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--hs-color-text-base)", display: "block", marginBottom: 8 }}>
                      Owners
                    </span>
                    <ProfilePicker
                      profiles={PROFILES}
                      selected={assignees}
                      onChange={setAssignees}
                      onAdd={() => undefined}
                      onManage={() => undefined}
                    />
                  </div>
                  <Combobox
                    label="Topic template"
                    options={[
                      { value: "webinar", label: "Webinar" },
                      { value: "launch", label: "Launch" },
                      { value: "tips", label: "Tips series" },
                    ]}
                    value={topic}
                    onChange={setTopic}
                    placeholder="Search templates…"
                  />
                  <Hyperlink href="#" onClick={(e) => e.preventDefault()}>
                    Open calendar integrations
                  </Hyperlink>
                </div>
              </CardSurface>

              <CardSurface variant="flat" header={<span style={{ fontSize: 16, fontWeight: 700, color: "var(--hs-color-text-base)" }}>Featured slot preview</span>}>
                <Media
                  ratio="16:9"
                  rounded="medium"
                  fallback={
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M18 22l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                />
                <div style={{ marginTop: 16 }}>
                  <Input
                    label="Notes for reviewers"
                    placeholder="Add context for the next sync…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardSurface>

              <CardSurface variant="flat" padding="medium">
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--hs-color-text-subtle)", display: "block", marginBottom: 12 }}>
                  Quick formatting
                </span>
                <ActionBar className="w-full flex-wrap">
                  <IconButton aria-label="Bold" variant="tonal" size="small" icon={<span style={{ fontWeight: 800 }}>B</span>} />
                  <IconButton aria-label="Italic" variant="tonal" size="small" icon={<span style={{ fontStyle: "italic" }}>I</span>} />
                  <ActionBarDivider />
                  <IconButton
                    aria-label="Link"
                    variant="ghost"
                    size="small"
                    icon={
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M7 11a3 3 0 010-4l2-2a3 3 0 114.2 4.2L12 11M11 7a3 3 0 010 4l-2 2a3 3 0 11-4.2-4.2L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    }
                  />
                  <Button variant="secondary" className="!py-2 !px-3 !text-[14px] ml-auto">
                    Save notes
                  </Button>
                </ActionBar>
              </CardSurface>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
