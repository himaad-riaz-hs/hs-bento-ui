import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Checkbox } from "../Checkbox";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  nodes: TreeNode[];
  selected?: Set<string>;
  onChange?: (selected: Set<string>) => void;
}

function getAllLeafIds(node: TreeNode): string[] {
  if (!node.children?.length) return [node.id];
  return node.children.flatMap(getAllLeafIds);
}

function TreeItem({
  node,
  depth,
  selected,
  onChange,
}: {
  node: TreeNode;
  depth: number;
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!node.children?.length;
  const leafIds = getAllLeafIds(node);
  const allSelected = leafIds.every((id) => selected.has(id));
  const someSelected = leafIds.some((id) => selected.has(id));

  const handleCheck = () => {
    const next = new Set(selected);
    if (allSelected) {
      leafIds.forEach((id) => next.delete(id));
    } else {
      leafIds.forEach((id) => next.add(id));
    }
    onChange(next);
  };

  return (
    <div>
      <div
        className="flex items-center gap-[4px] py-[2px]"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center h-[20px] w-[20px] rounded-[4px] hover:bg-[var(--hs-color-fill-base)] transition-colors text-[color:var(--hs-color-icon-subtle)]"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={cn("transition-transform", expanded && "rotate-90")}
            >
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className="w-[20px]" />
        )}
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={handleCheck}
          label={node.label}
        />
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Tree = forwardRef<HTMLDivElement, TreeProps>(
  ({ nodes, selected = new Set(), onChange, className, ...props }, ref) => {
    return (
      <div ref={ref} role="tree" className={cn("flex flex-col", className)} {...props}>
        {nodes.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            selected={selected}
            onChange={(s) => onChange?.(s)}
          />
        ))}
      </div>
    );
  }
);
Tree.displayName = "Tree";

export { Tree };
