import React, { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

export default function MapDetailsPanel({ item, onClose, onNavigate }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (item && window.matchMedia?.("(max-width: 767px)").matches)
      closeRef.current?.focus({ preventScroll: true });
  }, [item?.id]);
  if (!item)
    return (
      <aside className="map-details map-details--empty">
        <p>Wybierz węzeł</p>
        <span>Odkryj usługi, projekty i kompetencje.</span>
      </aside>
    );
  return (
    <aside
      className="map-details"
      aria-label={`Szczegóły: ${item.label}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="map-details__close"
        aria-label="Zamknij szczegóły"
        onClick={onClose}
      >
        <X size={18} />
      </button>
      <p className="map-details__category">{item.category}</p>
      <h2>{item.label}</h2>
      <p>{item.description || "Dowiedz się więcej na stronie portfolio."}</p>
      {item.status && <span className="map-details__status">{item.status}</span>}
      {item.href && (
        <a href={item.href} onClick={(event) => onNavigate(event, item)}>
          {item.href.startsWith("mailto:") ? "Napisz wiadomość" : "Przejdź do strony"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </aside>
  );
}
