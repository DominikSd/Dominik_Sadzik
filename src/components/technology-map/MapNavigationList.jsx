import React from "react";
import { Plus, Minus } from "lucide-react";
export default function MapNavigationList({
  model,
  expanded,
  selected,
  onSelect,
  onNavigate,
  mobile = false,
}) {
  const renderItem = (item) => {
    const open = expanded.includes(item.id);
    const branch = Boolean(item.children?.length);
    return (
      <li key={item.id}>
        <button
          type="button"
          data-map-id={item.id}
          className={item.featured ? "map-mobile-featured" : ""}
          aria-expanded={branch ? open : undefined}
          aria-pressed={selected === item.id}
          onClick={(event) => onSelect(item.id, event.currentTarget)}
        >
          {item.label}
          {branch &&
            (open ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />)}
        </button>
        {!mobile && open && item.href && (
          <a href={item.href} onClick={(event) => onNavigate(event, item)}>
            Przejdź
          </a>
        )}
        {branch && open && <ul>{item.children.map(renderItem)}</ul>}
      </li>
    );
  };
  return (
    <nav
      className={mobile ? "map-mobile-tree" : "map-link-list"}
      aria-label={mobile ? "Mobilna mapa portfolio" : "Mapa portfolio jako lista"}
    >
      <ul className="map-tree-roots">{[model.center, ...model.groups].map(renderItem)}</ul>
    </nav>
  );
}
