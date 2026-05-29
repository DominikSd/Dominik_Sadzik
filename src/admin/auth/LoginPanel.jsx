import React, { useState } from "react";
import PasswordLoginForm from "./PasswordLoginForm.jsx";
import MagicLinkForm from "./MagicLinkForm.jsx";
import PasswordRecoveryRequest from "./PasswordRecoveryRequest.jsx";

const authModes = [
  { key: "password", label: "Hasło" },
  { key: "magic", label: "Magic link" },
  { key: "recovery", label: "Reset hasła" },
];

export default function LoginPanel() {
  const [mode, setMode] = useState("password");

  return (
    <div className="grid min-h-screen place-items-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-500/10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Panel CMS
        </p>
        <h1 className="text-3xl font-black">Logowanie administratora</h1>

        <div className="mt-5 flex flex-wrap gap-2">
          {authModes.map((authMode) => (
            <button
              key={authMode.key}
              type="button"
              onClick={() => setMode(authMode.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                authMode.key === mode
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.045] text-slate-200 hover:bg-white/10"
              }`}
            >
              {authMode.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {mode === "password" && <PasswordLoginForm />}
          {mode === "magic" && <MagicLinkForm />}
          {mode === "recovery" && <PasswordRecoveryRequest />}
        </div>
      </div>
    </div>
  );
}
