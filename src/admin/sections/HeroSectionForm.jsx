import React from "react";
import { Field, FormGrid, TextArea, TextInput } from "./FormPrimitives";

export default function HeroSectionForm({ value, onChange }) {
  const update = (patch) => onChange({ ...value, ...patch });
  const updateCta = (name, patch) => update({ [name]: { ...value[name], ...patch } });

  return (
    <div className="space-y-5">
      <FormGrid>
        <Field label="Etykieta nad nagłówkiem">
          <TextInput
            value={value.eyebrow}
            onChange={(event) => update({ eyebrow: event.target.value })}
          />
        </Field>
        <Field label="Wyróżniona część nagłówka">
          <TextInput
            value={value.highlightedTitle}
            onChange={(event) => update({ highlightedTitle: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Nagłówek">
        <TextInput
          value={value.title}
          onChange={(event) => update({ title: event.target.value })}
        />
      </Field>
      <Field label="Opis">
        <TextArea
          value={value.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </Field>
      <FormGrid>
        <Field label="Tekst głównego CTA">
          <TextInput
            value={value.primaryCta.label}
            onChange={(event) => updateCta("primaryCta", { label: event.target.value })}
          />
        </Field>
        <Field label="Link głównego CTA">
          <TextInput
            value={value.primaryCta.href}
            onChange={(event) => updateCta("primaryCta", { href: event.target.value })}
          />
        </Field>
        <Field label="Tekst drugiego CTA">
          <TextInput
            value={value.secondaryCta.label}
            onChange={(event) => updateCta("secondaryCta", { label: event.target.value })}
          />
        </Field>
        <Field label="Link drugiego CTA">
          <TextInput
            value={value.secondaryCta.href}
            onChange={(event) => updateCta("secondaryCta", { href: event.target.value })}
          />
        </Field>
      </FormGrid>
    </div>
  );
}
