export function normalizeHash(hash) {
  if (typeof hash !== "string") return "#/";
  const trimmed = hash.replace(/^#\/?/, "").replace(/\/+$|^\/+/, "");
  return trimmed ? `#/${trimmed}` : "#/";
}

export function extractAuthHash(hash) {
  if (typeof hash !== "string") return hash;
  const accessIndex = hash.indexOf("access_token=");
  if (accessIndex >= 0) {
    return `#${hash.slice(accessIndex)}`;
  }

  const refreshIndex = hash.indexOf("refresh_token=");
  if (refreshIndex >= 0) {
    return `#${hash.slice(refreshIndex)}`;
  }

  return hash;
}

export function pathToHash(pathname, base = "/") {
  if (typeof pathname !== "string") return "#/";
  const pathSegments = pathname.split("/").filter(Boolean);
  const baseSegments = String(base).split("/").filter(Boolean);

  const normalizedSegments =
    baseSegments.length > 0 &&
    pathSegments.slice(0, baseSegments.length).join("/") === baseSegments.join("/")
      ? pathSegments.slice(baseSegments.length)
      : pathSegments;

  const route = normalizedSegments.join("/");
  return route ? `#/${route}` : "#/";
}
