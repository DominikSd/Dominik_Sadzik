import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Globe2,
  Code2,
  ShieldCheck,
  UserRound,
  Mail,
  Layers,
  ArrowRight,
  Minus,
} from "lucide-react";

const icons = {
  services: Globe2,
  projects: Code2,
  qa: ShieldCheck,
  about: UserRound,
  contact: Mail,
  center: Layers,
};
export default memo(function TechnologyNode({ data }) {
  const Icon = icons[data.id] || Code2;
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
