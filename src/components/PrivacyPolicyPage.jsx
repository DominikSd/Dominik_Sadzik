import React from "react";
import { ArrowLeft, BarChart3, Cookie, Database, Mail, ShieldCheck } from "lucide-react";

const sections = [
  {
    icon: Mail,
    title: "Formularz kontaktowy",
    text: "Jeśli wyślesz formularz, zapisane mogą zostać dane podane przez Ciebie: imię lub nazwa firmy, adres e-mail, telefon, opis projektu, preferencje dotyczące strony i materiały potrzebne do przygotowania odpowiedzi.",
  },
  {
    icon: Database,
    title: "Przechowywanie zgłoszeń",
    text: "Zgłoszenia z formularza są zapisywane w Supabase i mogą zostać przesłane e-mailem do właściciela strony. Dane służą wyłącznie do obsługi zapytania i przygotowania propozycji współpracy.",
  },
  {
    icon: BarChart3,
    title: "Statystyki odwiedzin",
    text: "Strona może korzystać z Google Analytics 4 do sprawdzania ogólnych statystyk odwiedzin. Analityka uruchamia się dopiero po wyrażeniu zgody w banerze zgody.",
  },
  {
    icon: Cookie,
    title: "Zgoda analityczna",
    text: "Informacja o zgodzie lub odmowie analityki może zostać zapisana w przeglądarce, żeby nie pytać o to przy każdej wizycie.",
  },
];

export default function PrivacyPolicyPage({ contact }) {
  const ownerEmail = contact?.email || "kontakt@dominik-sadzik.pl";

  return (
    <main className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 md:px-10">
      <div className="pointer-events-none absolute left-0 top-24 h-px w-48 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-px w-64 bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <a
          href="#/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć na stronę główną
        </a>

        <section className="py-10">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">Prywatność</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            Polityka prywatności
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Ta strona zbiera tylko dane potrzebne do kontaktu, obsługi zapytania i podstawowej
            analityki. Nie sprzedaję danych i nie używam ich do automatycznego profilowania.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
            Administratorem strony i osobą kontaktową w sprawie danych jest Dominik Sadzik.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur sm:p-7"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-white">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-cyan-300/20 bg-slate-950/60 p-5 shadow-2xl shadow-cyan-500/10 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Kontakt w sprawie danych</h2>
              <p className="mt-3 leading-7 text-slate-300">
                Jeśli chcesz zapytać o swoje dane, poprawić zgłoszenie albo poprosić o jego
                usunięcie, napisz na:
              </p>
              <a
                href={`mailto:${ownerEmail}`}
                className="mt-3 inline-flex break-all font-semibold text-cyan-200 hover:text-cyan-100"
              >
                {ownerEmail}
              </a>
              <p className="mt-5 text-sm leading-6 text-slate-500">
                To krótka informacja dla użytkowników strony, a nie porada prawna. Przy
                rozbudowanych usługach lub obsłudze klientów warto przygotować pełną politykę
                prywatności dopasowaną do konkretnego modelu działania.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
