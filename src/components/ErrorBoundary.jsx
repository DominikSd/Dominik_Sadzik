import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const title = this.props.title || "Wystąpił błąd";
    const description =
      this.props.description ||
      "Przepraszamy, coś poszło nie tak. Odśwież stronę lub sprawdź konsolę.";

    return (
      <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
        <div className="max-w-xl rounded-lg border border-red-300/30 bg-red-500/10 p-6">
          <h1 className="text-2xl font-black">{title}</h1>
          <p className="mt-3 leading-7 text-red-50/85">{description}</p>
          <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-slate-950/80 p-4 text-xs text-slate-200">
            {String(this.state.error)}
            {this.state.error?.stack && `\n\n${this.state.error.stack}`}
          </pre>
        </div>
      </div>
    );
  }
}
