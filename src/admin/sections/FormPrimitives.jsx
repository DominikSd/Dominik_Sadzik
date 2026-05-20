export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className="min-h-28 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
    />
  );
}

export function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300/70"
    />
  );
}

export function FormGrid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function ListEditor({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel = "Dodaj element",
}) {
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          {renderItem(item, index, (nextItem) => {
            const next = [...items];
            next[index] = nextItem;
            onChange(next);
          })}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => move(index, -1)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              W gore
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
            >
              W dol
            </button>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10"
            >
              Usun
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/15"
      >
        {addLabel}
      </button>
    </div>
  );
}
