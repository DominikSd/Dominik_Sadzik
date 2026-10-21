// Intersect the center-to-center ray with the visible rounded node boundary.
// Shapes use graph coordinates, so pan and zoom do not alter the attachments.
export function boundaryPoint(shape, toward) {
  const dx = toward.x - shape.x;
  const dy = toward.y - shape.y;
  const length = Math.hypot(dx, dy);
  if (!length) return { x: shape.x, y: shape.y };
  const ux = dx / length;
  const uy = dy / length;
  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;
  const radius = Math.min(shape.radius, halfWidth, halfHeight);
  let low = 0;
  let high = Math.hypot(halfWidth, halfHeight);
  // Signed distance to a rounded rectangle (a circle when width=height=2r).
  for (let i = 0; i < 32; i++) {
    const distance = (low + high) / 2;
    const qx = Math.abs(ux * distance) - (halfWidth - radius);
    const qy = Math.abs(uy * distance) - (halfHeight - radius);
    const outside =
      Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
    if (outside > 0) high = distance;
    else low = distance;
  }
  return { x: shape.x + ux * low, y: shape.y + uy * low };
}

export function connectionGeometry(source, target) {
  const start = boundaryPoint(source, target);
  const end = boundaryPoint(target, source);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  // A small perpendicular bow; control points always advance toward the target.
  // Unlike fixed horizontal handles this cannot produce a reversing loop.
  const bow = Math.min(22, distance * 0.07);
  const nx = distance ? -dy / distance : 0;
  const ny = distance ? dx / distance : 0;
  const c1 = { x: start.x + dx / 3 + nx * bow, y: start.y + dy / 3 + ny * bow };
  const c2 = { x: start.x + (dx * 2) / 3 + nx * bow, y: start.y + (dy * 2) / 3 + ny * bow };
  return {
    start,
    end,
    c1,
    c2,
    path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
  };
}
