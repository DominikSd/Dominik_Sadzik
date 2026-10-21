import React, {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createTechnologyMap,
  flattenMapItems,
  expansionPath,
  mapCopy,
} from "../../content/technologyMap.js";
import { trackContactClick, trackNavigationClick } from "../../lib/analytics/ga4.js";
const TechnologyGraph = lazy(() => import("./TechnologyGraph.jsx"));
import MapDetailsPanel from "./MapDetailsPanel.jsx";
import MapNavigationList from "./MapNavigationList.jsx";
import "./technologyMap.css";
import { ArrowUpRight } from "lucide-react";

class GraphBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p className="map-load-error">Nie udało się uruchomić grafu. Skorzystaj z listy poniżej.</p>
    ) : (
      this.props.children
    );
  }
}

export default function TechnologyMap({ content, onNavigate, full = false }) {
  const model = useMemo(() => createTechnologyMap(content), [content]);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [list, setList] = useState(false);
  const container = useRef(null);
  const returnFocus = useRef(null);
  const [desktop, setDesktop] = useState(
    () =>
      typeof ResizeObserver !== "undefined" &&
      (window.matchMedia?.("(min-width: 768px)").matches ?? false),
  );
  useEffect(() => {
    const media = window.matchMedia?.("(min-width: 768px)");
    if (!media) return;
    const update = () => setDesktop(media.matches && typeof ResizeObserver !== "undefined");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!window.IntersectionObserver || !container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (container.current) container.current.dataset.inView = String(entry.isIntersecting);
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const items = useMemo(() => flattenMapItems(model), [model]);
  const item = items.find((n) => n.id === selected);
  const select = useCallback(
    (id, trigger) => {
      returnFocus.current = trigger || document.activeElement;
      setSelected(id);
      setDetailsOpen(true);
      setExpanded((current) => expansionPath(model, id, current));
    },
    [model],
  );
  const close = () => {
    setDetailsOpen(false);
    requestAnimationFrame(() => {
      const target = returnFocus.current?.isConnected
        ? returnFocus.current
        : container.current?.querySelector(`[data-map-id="${selected}"]`);
      target?.focus({ preventScroll: true });
    });
  };
  const navigate = (event, node) => {
    if (node.href.startsWith("mailto:")) trackContactClick("email", "technology_map");
    else {
      trackNavigationClick(node.id, node.href, "technology_map");
      onNavigate(event, node.href);
    }
  };
  return (
    <section
      ref={container}
      className={`technology-map ${full ? "technology-map--full" : "technology-map--hero"}`}
      aria-label="Mapa technologiczna portfolio"
    >
      {full && (
        <div className="map-page-heading">
          <h1>{mapCopy.title}</h1>
          <p>{mapCopy.description}</p>
        </div>
      )}
      <div className="map-toolbar">
        <button
          type="button"
          className="map-list-toggle"
          aria-pressed={list}
          onClick={() => setList((value) => !value)}
        >
          {list ? "Pokaż graf" : "Widok listy"}
        </button>
      </div>
      <div className="map-workspace">
        <div className="map-main">
          {!list && desktop && (
            <div className="map-desktop">
              <GraphBoundary>
                <Suspense
                  fallback={
                    <div className="map-loading" role="status">
                      Ładowanie grafu…
                    </div>
                  }
                >
                  <TechnologyGraph
                    model={model}
                    expanded={expanded}
                    selected={selected}
                    onSelect={select}
                  />
                </Suspense>
              </GraphBoundary>
            </div>
          )}
          <div className={list || !desktop ? "" : "map-mobile"}>
            <MapNavigationList
              model={model}
              expanded={expanded}
              selected={selected}
              onSelect={select}
              onNavigate={navigate}
              mobile={!list}
            />
          </div>
          {!list && (
            <details className="map-accessible-list">
              <summary>Otwórz tekstową nawigację</summary>
              <MapNavigationList
                model={model}
                expanded={expanded}
                selected={selected}
                onSelect={select}
                onNavigate={navigate}
              />
            </details>
          )}
        </div>
        {(full || detailsOpen) && (
          <MapDetailsPanel item={detailsOpen ? item : null} onClose={close} onNavigate={navigate} />
        )}
      </div>
      {!full && (
        <a
          className="map-full-link"
          href="#/mapa"
          onClick={() => trackNavigationClick("mapa", "#/mapa", "hero_map")}
        >
          Odkryj mapę <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
