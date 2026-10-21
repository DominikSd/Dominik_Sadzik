import React, { memo } from "react";
import { BaseEdge } from "@xyflow/react";
import { connectionGeometry } from "./edgeGeometry.js";

export default memo(function TechnologyEdge({ id, data, style }) {
  const { path } = connectionGeometry(data.sourceShape, data.targetShape);
  return <BaseEdge id={id} path={path} style={style} interactionWidth={0} />;
});
