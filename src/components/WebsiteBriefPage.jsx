import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe2,
  Mail,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { trackFormSubmit } from "../lib/analytics/ga4";
import { submitWebsiteBrief } from "../lib/briefApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  preferredContact: "email",
  currentWebsite: "",
  projectTypes: [],
  websiteGoals: [],
  cmsNeeds: "",
  materials: {
    logo: "",
    texts: "",
    photos: "",
    domain: "",
    businessEmail: "",
    socialProfiles: "",
  },
  stylePreferences: [],
  inspirationLinks: "",
  addons: [],
  deadline: "",
  budget: "",
  projectDescription: "",
  consentContact: false,
};

const projectTypeOptions = [
  "prosta strona wizytówka",
  "strona z panelem administratora",
  "portfolio / galeria prac",
  "jedna strona promocyjna",
  "odświeżenie obecnej strony",
  "nie wiem, potrzebuję doradztwa",
];

const websiteGoalOptions = [
  "pokazanie oferty",
  "zdobywanie kontaktów od klientów",
  "umawianie wizyt lub konsultacji",
  "prezentacja realizacji lub portfolio",
  "publikowanie aktualności",
  "budowanie wiarygodności",
  "połączenie z mediami społecznościowymi",
  "inne",
];

const cmsOptions = [
  "tak, chcę edytować podstawowe teksty",
  "tak, chcę edytować ofertę, FAQ i kontakt",
  "tak, chcę dodawać aktualności lub ogłoszenia",
  "nie, wystarczy mi strona bez możliwości samodzielnej edycji",
  "nie wiem, proszę doradzić",
];

const materialFields = [
  ["logo", "Logo"],
  ["texts", "Teksty"],
  ["photos", "Zdjęcia lub grafiki"],
  ["domain", "Adres strony (domena)"],
  ["businessEmail", "Firmowa poczta"],
  ["socialProfiles", "Profile w mediach społecznościowych"],
];

const materialOptions = ["tak", "nie", "częściowo", "potrzebuję pomocy"];

const styleOptions = [
  "nowoczesna",
  "minimalistyczna",
  "elegancka",
  "techniczna",
  "spokojna/ciepła",
  "kolorowa",
  "premium",
  "jeszcze nie wiem",
];

const addonOptions = [
  "pomoc z adresem strony",
  "pomoc z miejscem na stronę",
  "poczta firmowa",
  "podstawowe przygotowanie pod Google",
  "statystyki odwiedzin strony",
  "zgłoszenie strony do Google",
  "opieka po publikacji",
  "wizytówki",
  "grafiki do mediów społecznościowych",
  "kod QR",
  "karty reklamowe / ulotki",
  "połączenie z zewnętrznymi narzędziami",
];

const deadlineOptions = [
  "jak najszybciej",
  "w ciągu 1-2 tygodni",
  "w ciągu miesiąca",
  "nie mam konkretnego terminu",
];

function toggleArrayValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function validateForm(form) {
  const errors = {};
  const emailValue = form.email.trim();
  const hasProjectContext = form.projectTypes.length > 0 || form.projectDescription.trim();

  if (!form.name.trim()) errors.name = "Podaj imię i nazwisko albo nazwę firmy.";
  if (!emailValue) {
    errors.email = "Podaj adres e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.email = "Podaj poprawny adres e-mail.";
  }
  if (!hasProjectContext) {
    errors.project = "Wybierz typ strony albo opisz krótko projekt.";
  }
  if (!form.consentContact) {
    errors.consentContact = "Zgoda na kontakt jest wymagana.";
  }

  return errors;
}

function TextField({ label, error, textarea = false, ...props }) {
  const Component = textarea ? "textarea" : "input";

  return (
    <label className="block min-w-0">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <Component
        {...props}
        className={`mt-2 w-full rounded-lg border bg-slate-950/65 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 ${
          error
            ? "border-rose-300/70 focus:border-rose-200"
            : "border-white/10 focus:border-cyan-300/70"
        } ${textarea ? "min-h-32 resize-y" : ""}`}
      />
      {error && <span className="mt-2 block text-sm text-rose-200">{error}</span>}
    </label>
  );
}

function ChoiceGroup({ legend, values, selectedValues, onToggle, columns = "sm:grid-cols-2" }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-200">{legend}</legend>
      <div className={`mt-3 grid gap-3 ${columns}`}>
        {values.map((value) => {
          const checked = selectedValues.includes(value);
          return (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                checked
                  ? "border-cyan-300/70 bg-cyan-300/12 text-cyan-50"
                  : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-cyan-300/35"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(value)}
                className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-300"
              />
              <span>{value}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioGroup({ legend, name, values, selectedValue, onChange, columns = "sm:grid-cols-2" }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-200">{legend}</legend>
      <div className={`mt-3 grid gap-3 ${columns}`}>
        {values.map((value) => {
          const checked = selectedValue === value;
          return (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                checked
                  ? "border-cyan-300/70 bg-cyan-300/12 text-cyan-50"
                  : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-cyan-300/35"
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(value)}
                className="h-4 w-4 border-white/20 bg-slate-950 text-cyan-300"
              />
              <span>{value}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function BriefSection({ icon: Icon, eyebrow, title, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur sm:p-7">
      <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan-300">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SuccessMessage({ live = false, className = "" }) {
  return (
    <div
      role={live ? "status" : undefined}
      className={`rounded-lg border border-emerald-300/35 bg-emerald-400/10 p-5 text-emerald-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <CheckCircle2 className="h-6 w-6 flex-none text-emerald-200" />
        <p>
          Dziękuję za przesłanie opisu strony. Otrzymałem Twoje zgłoszenie i odezwę się z propozycją
          zakresu lub dodatkowymi pytaniami.
        </p>
      </div>
    </div>
  );
}

export default function WebsiteBriefPage({ contact }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const ownerEmail = contact?.email || "kontakt@dominiksadzik.pl";
  const isSubmitting = status === "submitting";
  const selectedMaterials = useMemo(
    () => materialFields.filter(([key]) => form.materials[key]).length,
    [form.materials],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleFieldValue = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: toggleArrayValue(current[field] || [], value),
    }));
  };

  const updateMaterial = (key, value) => {
    setForm((current) => ({
      ...current,
      materials: {
        ...current.materials,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    try {
      setStatus("submitting");
      await submitWebsiteBrief(form);
      trackFormSubmit("website_brief");
      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("Website brief submit failed.", error);
      setStatus("error");
      setSubmitError(
        "Nie udało się wysłać formularza. Spróbuj ponownie albo napisz bezpośrednio na e-mail.",
      );
    }
  };

  return (
    <main className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 md:px-10">
      <div className="pointer-events-none absolute left-0 top-24 h-px w-48 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-px w-64 bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do kontaktu
        </a>

        <section className="grid gap-8 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-start">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
              Opisz stronę
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Opisz swoją stronę, a przygotuję wstępną propozycję
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Ten formularz pomoże mi zrozumieć, jakiej strony potrzebujesz: prostej wizytówki,
              strony z panelem administratora, pomocy z adresem strony, widocznością w Google albo
              późniejszą opieką. Nie musisz znać technicznych szczegółów — wystarczy, że opiszesz
              swój pomysł.
            </p>
          </div>

          <aside className="rounded-lg border border-cyan-300/20 bg-slate-950/60 p-5 text-center shadow-2xl shadow-cyan-500/10 sm:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Co dalej?</p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <p>
                Po wysłaniu formularza sprawdzę zakres i odezwę się z pytaniami albo propozycją.
              </p>
              <p>Jeśli wolisz szybki kontakt, możesz od razu napisać na:</p>
              <a
                href={`mailto:${ownerEmail}`}
                className="inline-flex break-all font-semibold text-cyan-200 hover:text-cyan-100"
              >
                {ownerEmail}
              </a>
            </div>
          </aside>
        </section>

        {status === "success" && <SuccessMessage live className="mb-8" />}

        {submitError && (
          <div
            role="alert"
            className="mb-8 rounded-lg border border-rose-300/35 bg-rose-400/10 p-5 text-rose-50"
          >
            {submitError}
          </div>
        )}

        <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
          <BriefSection icon={UserRound} eyebrow="01" title="Dane kontaktowe">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                label="Imię i nazwisko / nazwa firmy"
                value={form.name}
                error={errors.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Np. Anna Kowalska / Studio ABC"
              />
              <TextField
                label="E-mail"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="adres@email.pl"
              />
              <TextField
                label="Telefon, opcjonalnie"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+48 ..."
              />
              <TextField
                label="Obecna strona lub media społecznościowe, opcjonalnie"
                value={form.currentWebsite}
                onChange={(event) => updateField("currentWebsite", event.target.value)}
                placeholder="https://..."
              />
            </div>
            <RadioGroup
              legend="Preferowana forma kontaktu"
              name="preferredContact"
              values={["email", "telefon", "Discord/Messenger/inne"]}
              selectedValue={form.preferredContact}
              onChange={(value) => updateField("preferredContact", value)}
            />
          </BriefSection>

          <BriefSection icon={Globe2} eyebrow="02" title="Jakiej strony potrzebujesz?">
            <ChoiceGroup
              legend="Typ strony"
              values={projectTypeOptions}
              selectedValues={form.projectTypes}
              onToggle={(value) => toggleFieldValue("projectTypes", value)}
            />
            {errors.project && <p className="text-sm text-rose-200">{errors.project}</p>}
            <ChoiceGroup
              legend="Cel strony"
              values={websiteGoalOptions}
              selectedValues={form.websiteGoals}
              onToggle={(value) => toggleFieldValue("websiteGoals", value)}
            />
          </BriefSection>

          <BriefSection icon={ClipboardList} eyebrow="03" title="Edycja strony i materiały">
            <RadioGroup
              legend="Czy chcesz samodzielnie edytować treści na stronie?"
              name="cmsNeeds"
              values={cmsOptions}
              selectedValue={form.cmsNeeds}
              onChange={(value) => updateField("cmsNeeds", value)}
            />
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Materiały, które masz na start ({selectedMaterials}/{materialFields.length})
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {materialFields.map(([key, label]) => (
                  <div key={key} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <p className="font-semibold text-white">{label}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {materialOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateMaterial(key, option)}
                          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                            form.materials[key] === option
                              ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-50"
                              : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/35"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BriefSection>

          <BriefSection icon={Sparkles} eyebrow="04" title="Styl i dodatki">
            <ChoiceGroup
              legend="Jaki styl pasuje do Twojej strony?"
              values={styleOptions}
              selectedValues={form.stylePreferences}
              onToggle={(value) => toggleFieldValue("stylePreferences", value)}
            />
            <TextField
              label="Linki do stron, które Ci się podobają, albo opis stylu"
              textarea
              value={form.inspirationLinks}
              onChange={(event) => updateField("inspirationLinks", event.target.value)}
              placeholder="Możesz wkleić linki albo opisać klimat strony."
            />
            <ChoiceGroup
              legend="Dodatki i wsparcie"
              values={addonOptions}
              selectedValues={form.addons}
              onToggle={(value) => toggleFieldValue("addons", value)}
            />
          </BriefSection>

          <BriefSection icon={Clock} eyebrow="05" title="Termin, budżet i opis projektu">
            <RadioGroup
              legend="Termin"
              name="deadline"
              values={deadlineOptions}
              selectedValue={form.deadline}
              onChange={(value) => updateField("deadline", value)}
            />
            <TextField
              label="Orientacyjny budżet / uwagi do wyceny, opcjonalnie"
              value={form.budget}
              onChange={(event) => updateField("budget", event.target.value)}
              placeholder="Nie musisz podawać dokładnej kwoty."
            />
            <TextField
              label="Opisz krótko, czym się zajmujesz i czego oczekujesz od strony"
              textarea
              value={form.projectDescription}
              onChange={(event) => updateField("projectDescription", event.target.value)}
              placeholder="Napisz po ludzku, czego potrzebujesz. Techniczne szczegóły mogę dobrać później."
            />
          </BriefSection>

          <section className="rounded-lg border border-white/10 bg-slate-950/65 p-5 sm:p-7">
            <label className="flex cursor-pointer flex-col gap-3 text-center sm:flex-row sm:text-left">
              <input
                type="checkbox"
                checked={form.consentContact}
                onChange={(event) => updateField("consentContact", event.target.checked)}
                className="mx-auto mt-1 h-5 w-5 flex-none rounded border-white/20 bg-slate-950 text-cyan-300 sm:mx-0"
              />
              <span className="text-sm leading-6 text-slate-300">
                Wyrażam zgodę na kontakt w sprawie przesłanego zapytania.
                <span className="block text-slate-500">
                  Dane z formularza są używane tylko do odpowiedzi na zgłoszenie i przygotowania
                  propozycji zakresu.
                </span>
              </span>
            </label>
            {errors.consentContact && (
              <p className="mt-3 text-center text-sm text-rose-200 sm:text-left">
                {errors.consentContact}
              </p>
            )}
          </section>

          <div className="flex flex-col items-center gap-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-bold text-white">Gotowe?</p>
              <p className="mt-1 text-sm text-slate-300">
                Wyślij opis, a wrócę z propozycją zakresu lub dodatkowymi pytaniami.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full gradient-button px-6 py-3 text-sm font-bold shadow-xl shadow-blue-500/25 transition hover:scale-105 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              <span>{isSubmitting ? "Wysyłam..." : "Wyślij opis strony"}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>

          {status === "success" && <SuccessMessage />}
        </form>
      </div>
    </main>
  );
}
