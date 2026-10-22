import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Globe2,
  FolderOpen,
  ShieldCheck,
  UserRound,
  Mail,
  Monitor,
  SlidersHorizontal,
  Search,
  HeartHandshake,
  LayoutDashboard,
  AppWindow,
  PanelTop,
  Palette,
  Gamepad2,
  ListChecks,
  Award,
  Cog,
  Cpu,
  Wrench,
  Compass,
  FileEdit,
  Send,
  PenTool,
  Printer,
  FileText,
  ArrowRight,
  Minus,
} from "lucide-react";

const icons = {
  globe: Globe2,
  folder: FolderOpen,
  shield: ShieldCheck,
  person: UserRound,
  contact: Mail,
  monitor: Monitor,
  settings: SlidersHorizontal,
  search: Search,
  handshake: HeartHandshake,
  dashboard: LayoutDashboard,
  application: AppWindow,
  browser: PanelTop,
  palette: Palette,
  gamepad: Gamepad2,
  checklist: ListChecks,
  award: Award,
  automation: Cog,
  cpu: Cpu,
  tools: Wrench,
  compass: Compass,
  form: FileEdit,
  email: Send,
  brand: PenTool,
  print: Printer,
  file: FileText,
};
export default memo(function TechnologyNode({ data }) {
  const Icon = icons[data.icon] || FileText;
  return (
    <div
      className={`tech-node tech-node--${data.color} ${data.featured ? "tech-node--featured" : ""} ${data.leaf ? "tech-node--leaf" : ""} ${data.selected ? "is-selected" : ""}`}
      style={{ "--node-size": `${data.size}px` }}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <button
        type="button"
        data-cursor-target="node"
        data-map-id={data.id}
        className="nodrag nopan"
        onClick={(event) => data.onSelect(data.id, event.currentTarget)}
        aria-expanded={data.children ? data.expanded : undefined}
        aria-pressed={data.selected}
      >
        <Icon size={data.featured ? 30 : 23} strokeWidth={1.5} aria-hidden="true" />
        <span>{data.label}</span>
        {data.children &&
          (data.expanded ? (
            <Minus size={14} aria-hidden="true" />
          ) : (
            <ArrowRight size={14} aria-hidden="true" />
          ))}
      </button>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
});
