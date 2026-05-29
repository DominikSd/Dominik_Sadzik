import React, { useState } from "react";
import { requireSupabase } from "../../lib/supabaseClient.js";

export default function PasswordLoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const { error } = await requireSupabase().auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);

    if (error) {
      setError("Nie udało się zalogować. Sprawdź dane i spróbuj ponownie.");
      return;
    }

    onLogin?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Hasło</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
      >
        {busy ? "Logowanie..." : "Zaloguj"}
      </button>
    </form>
  );
}
