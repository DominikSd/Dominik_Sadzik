const angles = {
  projects: -Math.PI / 4,
  qa: (-3 * Math.PI) / 4,
  about: (3 * Math.PI) / 4,
  contact: Math.PI / 4,
};

export function buildGraph(model, expanded, selected, onSelect) {
  const open = new Set(expanded || []);
  const nodes = [];
  const edges = [];
  const boxes = [];
  const contains = (item) => item.id === selected || item.children?.some(contains);
  function place(item, x, y, depth, angle, parent) {
    const size = item.featured ? 200 : depth === 0 ? 132 : 86;
    const leaf = depth > 0;
    const width = leaf ? 190 : size;
    const height = leaf ? 90 : size;
    const box = { x: x - width / 2, y: y - height / 2, width, height };
    boxes.push(box);
    nodes.push({
      id: item.id,
      type: "technology",
      position: { x: box.x, y: box.y },
      draggable: false,
      selectable: false,
      focusable: false,
      data: {
        ...item,
        size,
        shape: { x, y, width, height, radius: leaf ? 14 : size / 2 },
        leaf,
        expanded: open.has(item.id),
        selected: selected === item.id,
        onSelect,
      },
    });
    if (parent)
      edges.push({
        id: `${parent}-${item.id}`,
        source: parent,
        target: item.id,
        className: contains(item) ? "map-edge-active" : "",
      });
    return { item, x, y, angle, depth };
  }
  // The offer is the actual graph root. Other primary areas radiate from it.
  const parents = [place(model.center, 0, 0, 0, -Math.PI / 2)];
  model.groups.forEach((item, index) => {
    const angle = angles[item.id] ?? (index / model.groups.length) * Math.PI * 2;
    parents.push(
      place(item, Math.cos(angle) * 375, Math.sin(angle) * 280, 0, angle, model.center.id),
    );
  });
  // Lay out one opened path as outward-facing fans, at every hierarchy level.
  for (let cursor = 0; cursor < parents.length; cursor++) {
    const branch = parents[cursor];
    if (!open.has(branch.item.id)) continue;
    const children = branch.item.children || [];
    const spread = Math.min(Math.PI * 0.9, Math.max(0.8, (children.length - 1) * 0.6));
    children.forEach((item, index) => {
      const angle =
        branch.angle + (children.length === 1 ? 0 : (index / (children.length - 1) - 0.5) * spread);
      let distance = 290;
      let x, y;
      // Preserve legible spacing without a continuous force simulation.
      do {
        x = branch.x + Math.cos(angle) * distance;
        y = branch.y + Math.sin(angle) * distance;
        distance += 45;
      } while (
        boxes.some(
          (b) =>
            Math.abs(x - (b.x + b.width / 2)) < (190 + b.width) / 2 + 28 &&
            Math.abs(y - (b.y + b.height / 2)) < (90 + b.height) / 2 + 28,
        )
      );
      parents.push(place(item, x, y, branch.depth + 1, angle, branch.item.id));
    });
  }
  const shapes = new Map(nodes.map((node) => [node.id, node.data.shape]));
  edges.forEach((edge) => {
    edge.type = "technology";
    edge.data = { sourceShape: shapes.get(edge.source), targetShape: shapes.get(edge.target) };
  });
  return { nodes, edges };
}

export function branchFocusIds(model, expanded) {
  const id = expanded?.at(-1);
  if (!id) return null;
  const find = (item) => (item.id === id ? item : item.children?.map(find).find(Boolean));
  const branch = [model.center, ...model.groups].map(find).find(Boolean);
  return branch ? [branch.id, ...(branch.children || []).map((item) => item.id)] : null;
}

// Pan limits grow with opened branches and leave a modest navigation margin.
// At maximum zoom (1.7), that margin is still smaller than the visible world.
export function mapPanExtent(nodes, width, height) {
  if (!nodes.length || !width || !height) return undefined;
  let left = Infinity,
    top = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  for (const node of nodes) {
    const shape = node.data.shape;
    left = Math.min(left, node.position.x);
    top = Math.min(top, node.position.y);
    right = Math.max(right, node.position.x + shape.width);
    bottom = Math.max(bottom, node.position.y + shape.height);
  }
  const marginX = width * 0.35;
  const marginY = height * 0.35;
  return [
    [left - marginX, top - marginY],
    [right + marginX, bottom + marginY],
  ];
}

// Rectangular pan bounds can contain empty corners between radial branches.
// If a gesture ends there, return the closest actual node as a camera anchor.
export function emptyViewAnchor(nodes, viewport, width, height) {
  if (!nodes.length || !width || !height) return null;
  const left = (64 - viewport.x) / viewport.zoom;
  const right = (width - 64 - viewport.x) / viewport.zoom;
  const top = (52 - viewport.y) / viewport.zoom;
  const bottom = (height - 52 - viewport.y) / viewport.zoom;
  if (
    nodes.some(
      ({ position, data: { shape } }) =>
        position.x + shape.width > left &&
        position.x < right &&
        position.y + shape.height > top &&
        position.y < bottom,
    )
  )
    return null;
  const x = (width / 2 - viewport.x) / viewport.zoom;
  const y = (height / 2 - viewport.y) / viewport.zoom;
  let nearest = null;
  let distance = Infinity;
  for (const node of nodes) {
    const shape = node.data.shape;
    const squared = (shape.x - x) ** 2 + (shape.y - y) ** 2;
    if (squared < distance) {
      nearest = shape;
      distance = squared;
    }
  }
  return nearest;
}
