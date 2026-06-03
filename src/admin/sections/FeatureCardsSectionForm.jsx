import React from "react";
import { Field, FormGrid, ListEditor, SelectInput, TextArea, TextInput } from "./FormPrimitives";

const iconOptions = [
  ["monitor", "Monitor"],
  ["palette", "Paleta"],
  ["sparkles", "Iskry"],
  ["globe", "Globus"],
  ["check", "Check"],
];

export default function FeatureCardsSectionForm({
  value,
  onChange,
  addLabel = "Dodaj karte",
  showCertificate = false,
  showSecondaryCta = false,
}) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <FormGrid>
        <Field label="Etykieta sekcji">
          <TextInput
            value={value.eyebrow}
            onChange={(event) => update({ eyebrow: event.target.value })}
          />
        </Field>
        <Field label="Naglowek">
          <TextInput
            value={value.title}
            onChange={(event) => update({ title: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Opis sekcji">
        <TextArea value={value.text} onChange={(event) => update({ text: event.target.value })} />
      </Field>
      {showCertificate && (
        <Field label="Informacja o certyfikacie / wiarygodnosci">
          <TextInput
            value={value.certificateNote || ""}
            onChange={(event) => update({ certificateNote: event.target.value })}
          />
        </Field>
      )}
      <FormGrid>
        <Field label="CTA label">
          <TextInput
            value={value.ctaLabel}
            onChange={(event) => update({ ctaLabel: event.target.value })}
          />
        </Field>
        <Field label="CTA link">
          <TextInput
            value={value.ctaHref}
            onChange={(event) => update({ ctaHref: event.target.value })}
          />
        </Field>
      </FormGrid>
      {showSecondaryCta && (
        <FormGrid>
          <Field label="Drugie CTA label">
            <TextInput
              value={value.secondaryCtaLabel || ""}
              onChange={(event) => update({ secondaryCtaLabel: event.target.value })}
            />
          </Field>
          <Field label="Drugie CTA link">
            <TextInput
              value={value.secondaryCtaHref || ""}
              onChange={(event) => update({ secondaryCtaHref: event.target.value })}
            />
          </Field>
        </FormGrid>
      )}
      <ListEditor
        items={value.cards}
        onChange={(cards) => update({ cards })}
        createItem={() => ({ icon: "sparkles", title: "Nowa karta", text: "Opis karty" })}
        addLabel={addLabel}
        maxItems={6}
        renderItem={(item, index, updateItem) => (
          <div className="space-y-4">
            <FormGrid>
              <Field label={`Tytul karty ${index + 1}`}>
                <TextInput
                  value={item.title}
                  onChange={(event) => updateItem({ ...item, title: event.target.value })}
                />
              </Field>
              <Field label="Ikona">
                <SelectInput
                  value={item.icon}
                  onChange={(event) => updateItem({ ...item, icon: event.target.value })}
                >
                  {iconOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </FormGrid>
            <Field label="Opis">
              <TextArea
                value={item.text}
                onChange={(event) => updateItem({ ...item, text: event.target.value })}
              />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
