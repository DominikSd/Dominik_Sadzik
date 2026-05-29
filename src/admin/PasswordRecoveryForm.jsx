import { useEffect, useState } from "react";
import { adminHashPath, requireSupabase, supabase } from "../lib/supabaseClient";

export default function PasswordRecoveryForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        setError(
          "Nie znaleziono sesji. Spróbuj ponownie kliknąć link resetu hasła lub wyślij go jeszcze raz.",
        );
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (password.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await requireSupabase().auth.updateUser({
      password,
    });
    setIsLoading(false);

    if (updateError) {
      setError(`Nie udało się zmienić hasła. ${updateError.message}`);
      return;
    }

    setStatus("Hasło zostało zmienione. Teraz przekierowuję do panelu.");
    window.location.hash = `#/${adminHashPath}`;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-500/10"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Reset hasła CMS
        </p>
        <h1 className="text-3xl font-black">Ustaw nowe hasło</h1>
        <p className="mt-3 text-sm text-slate-400">
          Użyj tego formularza, aby ustawić nowe hasło dla panelu CMS.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nowe hasło</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Powtórz nowe hasło</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
        </div>

        {status && (
          <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {status}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <button
          disabled={isLoading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {isLoading ? "Przetwarzanie..." : "Ustaw nowe hasło"}
        </button>
      </form>
    </div>
  );
}
