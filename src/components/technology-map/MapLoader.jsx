import React, { Component, lazy, Suspense } from "react";
const TechnologyMap = lazy(() => import("./TechnologyMap.jsx"));

class MapBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="map-load-error" role="status">
        <p>Mapa jest chwilowo niedostępna.</p>
        <a href="#offer">Zobacz ofertę</a> · <a href="#projects">Zobacz realizacje</a> ·{" "}
        <a href="#contact">Kontakt</a>
      </div>
    ) : (
      this.props.children
    );
  }
}

export default function MapLoader(props) {
  return (
    <MapBoundary>
      <Suspense
        fallback={
          <div className="map-loading" role="status">
            Ładowanie mapy… <a href="#offer">Zobacz ofertę</a>
          </div>
        }
      >
        <TechnologyMap {...props} />
      </Suspense>
    </MapBoundary>
  );
}
