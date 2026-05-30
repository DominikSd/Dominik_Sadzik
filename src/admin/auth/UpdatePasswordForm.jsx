import React, { useEffect, useState } from "react";
import { requireSupabase } from "../../lib/supabaseClient.js";
import { clearAuthHashParams, clearAuthQueryParams, getAdminUrl } from "./authRedirects.js";

function getUrlAuthError() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = getHashParams();

  return (
    searchParams.get("error_description") ||
    searchParams.get("error") ||
    hashParams.get("error_description") ||
    hashParams.get("error") ||
    ""
  );
}

function getHashParams() {
  return new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
}

async function restoreRecoverySessionFromHash(client) {
  const hashParams = getHashParams();
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const type = hashParams.get("type");

  if (type !== "recovery" || !accessToken || !refreshToken) {
    return false;
  }

  const { error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }

  return true;
}

export default function UpdatePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let active = true;
    let recoverySessionObserved = false;
    let unsubscribe = () => {};

    async function prepareRecoverySession() {
      try {
        const client = requireSupabase();
        const urlError = getUrlAuthError();

        if (urlError) {
          throw new Error(urlError);
        }

        const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
          if (!active || !session) return;
          if (_event !== "PASSWORD_RECOVERY" && _event !== "SIGNED_IN") return;
          recoverySessionObserved = true;
          setHasRecoverySession(true);
          setError("");
          setLoading(false);
        });

        unsubscribe = () => subscription.subscription.unsubscribe();

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        }

        const restoredFromHash = await restoreRecoverySessionFromHash(client);
        const { data, error: sessionError } = await client.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!active) return;

        if (data.session) {
          recoverySessionObserved = true;
          setHasRecoverySession(true);
          if (restoredFromHash) {
            clearAuthHashParams();
          }
        } else if (!recoverySessionObserved) {
          setHasRecoverySession(false);
          setError(
            "Brak aktywnej sesji resetu hasła. Link mógł wygasnąć albo zostać już użyty. Wyślij link resetu ponownie z panelu.",
          );
        }
      } catch (authError) {
        if (!active) return;
        setHasRecoverySession(false);
        setError(
          `Nie udało się otworzyć sesji resetu hasła. Link mógł wygasnąć albo zostać już użyty. Błąd Supabase Auth: ${
            authError.message || "nieznany błąd"
          }`,
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    prepareRecoverySession();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!hasRecoverySession) {
      setError(
        "Brak aktywnej sesji resetu hasła. Wyślij nowy link resetu i otwórz go z tej samej przeglądarki.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }

    setLoading(true);

    const { error } = await requireSupabase().auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setError(`Nie udało się zaktualizować hasła. Błąd Supabase Auth: ${error.message}`);
      return;
    }

    setStatus("Hasło zostało zmienione. Przekierowuję do panelu...");
    clearAuthQueryParams();
    window.location.href = getAdminUrl();
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
          Wprowadź nowe hasło, aby dokończyć reset hasła.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nowe hasło</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              disabled={!hasRecoverySession || loading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Powtórz nowe hasło</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              disabled={!hasRecoverySession || loading}
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-3 text-white outline-none focus:border-cyan-300/70"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
          type="submit"
          disabled={loading || !hasRecoverySession}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Sprawdzam..." : "Zapisz nowe hasło"}
        </button>
      </form>
    </div>
  );
}
