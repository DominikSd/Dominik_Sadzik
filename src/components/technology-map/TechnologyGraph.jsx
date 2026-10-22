import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Background, ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { useReducedMotion } from "framer-motion";
import { Plus, Minus, Scan } from "lucide-react";
import TechnologyNode from "./TechnologyNode.jsx";
import TechnologyEdge from "./TechnologyEdge.jsx";
import { buildGraph, branchFocusIds, mapPanExtent, emptyViewAnchor } from "./mapLayout.js";
import "@xyflow/react/dist/style.css";

const nodeTypes = { technology: TechnologyNode };
const edgeTypes = { technology: TechnologyEdge };
const edgeOptions = { type: "technology" };
function TechnologyGraph({ model, expanded, selected, onSelect }) {
  const flow = useReactFlow();
  const reduced = useReducedMotion();
  const viewport = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { nodes, edges } = useMemo(
    () => buildGraph(model, expanded, selected, onSelect),
    [model, expanded, selected, onSelect],
  );
  const panExtent = useMemo(() => mapPanExtent(nodes, size.width, size.height), [nodes, size]);
  const fit = useCallback(
    () => flow.fitView({ padding: 0.06, duration: reduced ? 0 : 280, maxZoom: 1 }),
    [flow, reduced],
  );
  useEffect(() => {
    const ids = branchFocusIds(model, expanded);
    const timeout = setTimeout(
      () =>
        flow.fitView({
          ...(ids ? { nodes: ids.map((id) => ({ id })) } : {}),
          padding: ids ? 0.24 : 0.06,
          duration: reduced ? 0 : 420,
          maxZoom: ids ? 1.1 : 1,
        }),
      70,
    );
    return () => clearTimeout(timeout);
  }, [expanded, model, flow, reduced]);
  useEffect(() => {
    let resizeFrame = 0;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) =>
        current.width === width && current.height === height ? current : { width, height },
      );
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(fit);
    });
    if (viewport.current) observer.observe(viewport.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
    };
  }, [fit]);
  return (
    <div
      className="technology-graph"
      ref={viewport}
      data-cursor-zone="map"
      data-cursor-state="idle"
      onFocusCapture={(event) => {
        const button = event.target.closest("[data-map-id]");
        if (!button?.matches(":focus-visible")) return;
        const rect = button.getBoundingClientRect();
        const canvas = viewport.current.getBoundingClientRect();
        const inset = 64;
        if (
          rect.left >= canvas.left + inset &&
          rect.right <= canvas.right - inset &&
          rect.top >= canvas.top + inset &&
          rect.bottom <= canvas.bottom - inset
        )
          return;
        const node = nodes.find((item) => item.id === button.dataset.mapId);
        if (node)
          flow.setCenter(node.data.shape.x, node.data.shape.y, {
            zoom: flow.getZoom(),
            duration: reduced ? 0 : 200,
          });
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        fitViewOptions={{ padding: 0.06, maxZoom: 1 }}
        translateExtent={panExtent}
        minZoom={0.3}
        maxZoom={1.7}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        zoomOnDoubleClick={false}
        onMoveStart={() => {
          if (viewport.current) viewport.current.dataset.cursorState = "dragging";
        }}
        onMoveEnd={() => {
          if (viewport.current) viewport.current.dataset.cursorState = "idle";
          const camera = flow.getViewport();
          const anchor = emptyViewAnchor(nodes, camera, size.width, size.height);
          if (anchor)
            flow.setCenter(anchor.x, anchor.y, { zoom: camera.zoom, duration: reduced ? 0 : 220 });
        }}
        aria-label="Interaktywna mapa portfolio"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#38bdf8" gap={32} size={0.65} />
      </ReactFlow>
      <div className="map-zoom" role="group" aria-label="Sterowanie widokiem mapy">
        <button
          type="button"
          aria-label="Przybliż mapę"
          onClick={() => flow.zoomIn({ duration: reduced ? 0 : 160 })}
        >
          <Plus size={17} />
        </button>
        <button
          type="button"
          aria-label="Oddal mapę"
          onClick={() => flow.zoomOut({ duration: reduced ? 0 : 160 })}
        >
          <Minus size={17} />
        </button>
        <button type="button" aria-label="Wycentruj mapę" onClick={fit}>
          <Scan size={17} />
        </button>
      </div>
    </div>
  );
}

export default function TechnologyGraphWithProvider(props) {
  return (
    <ReactFlowProvider>
      <TechnologyGraph {...props} />
    </ReactFlowProvider>
  );
}
