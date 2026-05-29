import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { clearAuthQueryParams, getAdminUrl } from "./authRedirects.js";

export default function AuthCallbackHandler() {
  const [status, setStatus] = useState("Weryfikuję magic link...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        clearAuthQueryParams();
        window.location.href = getAdminUrl();
        return;
      }

      setStatus("");
      setError("Nie udało się zalogować. Jeśli link wygasł, spróbuj ponownie wysłać magic link.");
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) {
        clearAuthQueryParams();
        window.location.href = getAdminUrl();
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
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
