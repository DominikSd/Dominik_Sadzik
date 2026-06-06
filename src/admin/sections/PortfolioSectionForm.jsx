import React from "react";
import { Field, FormGrid, ListEditor, SelectInput, TextArea, TextInput } from "./FormPrimitives";

const statusOptions = [
  "realizacja",
  "projekt demo",
  "koncepcja",
  "prototyp",
  "projekt wlasny",
  "projekt koncepcyjny",
];

const toneOptions = ["cyan", "violet", "blue", "emerald"];

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function PortfolioSectionForm({ value, onChange }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <FormGrid>
        <Field label="Etykieta">
          <TextInput
            value={value.eyebrow}
            onChange={(event) => update({ eyebrow: event.target.value })}
          />
        </Field>
        <Field label="Tytuł">
          <TextInput
            value={value.title}
            onChange={(event) => update({ title: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Opis">
        <TextArea value={value.text} onChange={(event) => update({ text: event.target.value })} />
      </Field>
      <ListEditor
        items={value.items}
        onChange={(items) => update({ items })}
        addLabel="Dodaj projekt"
        maxItems={12}
        createItem={() => ({
          type: "Projekt demo",
          title: "Nowy projekt",
          text: "Krótki opis projektu.",
          details: "",
          status: "projekt demo",
          category: "",
          tags: [],
          href: "",
          linkLabel: "Zobacz projekt",
          screenshotUrl: "",
          mockupTone: "cyan",
        })}
        renderItem={(item, index, updateItem) => (
          <div className="space-y-4">
            <FormGrid>
              <Field label={`Typ projektu ${index + 1}`}>
                <TextInput
                  value={item.type || ""}
                  onChange={(event) => updateItem({ ...item, type: event.target.value })}
                />
              </Field>
              <Field label="Status">
                <SelectInput
                  value={item.status || "projekt koncepcyjny"}
                  onChange={(event) => updateItem({ ...item, status: event.target.value })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </FormGrid>
            <Field label="Tytuł">
              <TextInput
                value={item.title}
                onChange={(event) => updateItem({ ...item, title: event.target.value })}
              />
            </Field>
            <Field label="Opis">
              <TextArea
                value={item.text}
                onChange={(event) => updateItem({ ...item, text: event.target.value })}
              />
            </Field>
            <Field label="Co zrobiłem / szczegóły">
              <TextArea
                value={item.details || ""}
                onChange={(event) => updateItem({ ...item, details: event.target.value })}
              />
            </Field>
            <FormGrid>
              <Field label="Kategoria">
                <TextInput
                  value={item.category || ""}
                  onChange={(event) => updateItem({ ...item, category: event.target.value })}
                />
              </Field>
              <Field label="Tagi" hint="Oddziel tagi przecinkami.">
                <TextInput
                  value={(item.tags || []).join(", ")}
                  onChange={(event) => updateItem({ ...item, tags: splitTags(event.target.value) })}
                />
              </Field>
            </FormGrid>
            <FormGrid>
              <Field label="Link">
                <TextInput
                  value={item.href || ""}
                  onChange={(event) => updateItem({ ...item, href: event.target.value })}
                />
              </Field>
              <Field label="Etykieta linku">
                <TextInput
                  value={item.linkLabel || ""}
                  onChange={(event) => updateItem({ ...item, linkLabel: event.target.value })}
                />
              </Field>
            </FormGrid>
            <FormGrid>
              <Field label="Screenshot / mockup URL">
                <TextInput
                  value={item.screenshotUrl || ""}
                  onChange={(event) => updateItem({ ...item, screenshotUrl: event.target.value })}
                />
              </Field>
              <Field label="Kolor mockupu">
                <SelectInput
                  value={item.mockupTone || "cyan"}
                  onChange={(event) => updateItem({ ...item, mockupTone: event.target.value })}
                >
                  {toneOptions.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </FormGrid>
          </div>
        )}
      />
    </div>
  );
}
