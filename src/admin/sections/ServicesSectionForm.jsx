import { Field, FormGrid, ListEditor, SelectInput, TextArea, TextInput } from "./FormPrimitives";

export default function ServicesSectionForm({ value, onChange }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <FormGrid>
        <Field label="Etykieta sekcji">
          <TextInput value={value.eyebrow} onChange={(event) => update({ eyebrow: event.target.value })} />
        </Field>
        <Field label="Naglowek">
          <TextInput value={value.title} onChange={(event) => update({ title: event.target.value })} />
        </Field>
      </FormGrid>
      <Field label="Opis sekcji">
        <TextArea value={value.text} onChange={(event) => update({ text: event.target.value })} />
      </Field>
      <ListEditor
        items={value.items}
        onChange={(items) => update({ items })}
        createItem={() => ({ icon: "monitor", title: "Nowa usluga", text: "Opis uslugi" })}
        addLabel="Dodaj usluge"
        renderItem={(item, index, updateItem) => (
          <div className="space-y-4">
            <FormGrid>
              <Field label={`Tytul uslugi ${index + 1}`}>
                <TextInput value={item.title} onChange={(event) => updateItem({ ...item, title: event.target.value })} />
              </Field>
              <Field label="Ikona / typ">
                <SelectInput value={item.icon} onChange={(event) => updateItem({ ...item, icon: event.target.value })}>
                  <option value="monitor">Monitor</option>
                  <option value="palette">Paleta</option>
                  <option value="sparkles">Iskry</option>
                  <option value="globe">Globus</option>
                </SelectInput>
              </Field>
            </FormGrid>
            <Field label="Opis">
              <TextArea value={item.text} onChange={(event) => updateItem({ ...item, text: event.target.value })} />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
