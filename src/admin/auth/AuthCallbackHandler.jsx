import React, { useEffect, useState } from "react";
import { requireSupabase } from "../../lib/supabaseClient.js";
import { clearAuthQueryParams, getAdminUrl } from "./authRedirects.js";

function getUrlAuthError() {
  const params = new URLSearchParams(window.location.search);
  return params.get("error_description") || params.get("error") || "";
}

async function restoreSessionFromHash(client) {
  const hashParams = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  const { error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }
}

export default function AuthCallbackHandler() {
  const [status, setStatus] = useState("Weryfikuję magic link...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let redirected = false;
    let unsubscribe = () => {};

    function redirectToAdmin() {
      if (redirected) return;
      redirected = true;
      clearAuthQueryParams();
      window.location.href = getAdminUrl();
    }

    async function completeCallback() {
      try {
        const client = requireSupabase();
        const urlError = getUrlAuthError();

        if (urlError) {
          throw new Error(urlError);
        }

        const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
          if (!active || !session) return;
          redirectToAdmin();
        });

        unsubscribe = () => subscription.subscription.unsubscribe();

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          setStatus("Kończę logowanie przez Supabase Auth...");
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        }

        await restoreSessionFromHash(client);
        const { data, error: sessionError } = await client.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!active) return;

        if (data.session) {
          redirectToAdmin();
          return;
        }

        setStatus("");
        setError(
          "Nie udało się zalogować. Callback logowania nie utworzył sesji. Link mógł wygasnąć albo został już użyty. Wyślij magic link ponownie.",
        );
      } catch (authError) {
        if (!active) return;
        setStatus("");
        setError(
          `Nie udało się zalogować. Link mógł wygasnąć albo zostać już użyty. Błąd Supabase Auth: ${
            authError.message || "nieznany błąd"
          }`,
        );
      }
    }

    completeCallback();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-500/10">
        <h1 className="text-3xl font-black">Logowanie przez magic link</h1>
        {status && (
          <p className="mt-4 rounded-lg border border-cyan-300/30 bg-cyan-400/10 p-3 text-sm text-cyan-100">
            {status}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </p>
        )}
        <div className="mt-6 text-sm text-slate-300">
          Jeśli problem się powtarza, wróć do panelu i wyślij magic link ponownie.
        </div>
      </div>
    </div>
  );
}
