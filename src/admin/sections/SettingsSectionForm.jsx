import { Field, FormGrid, ListEditor, TextInput } from "./FormPrimitives";

export default function SettingsSectionForm({ value, onChange }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <FormGrid>
        <Field label="Nazwa strony">
          <TextInput
            value={value.siteName}
            onChange={(event) => update({ siteName: event.target.value })}
          />
        </Field>
        <Field label="Dopisek w naglowku">
          <TextInput
            value={value.tagline}
            onChange={(event) => update({ tagline: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Tekst stopki">
        <TextInput
          value={value.footerText}
          onChange={(event) => update({ footerText: event.target.value })}
        />
      </Field>
      <ListEditor
        items={value.navItems}
        onChange={(navItems) => update({ navItems })}
        createItem={() => ({ label: "Nowa pozycja", href: "#kontakt" })}
        addLabel="Dodaj link"
        renderItem={(item, index, updateItem) => (
          <FormGrid>
            <Field label={`Tekst linku ${index + 1}`}>
              <TextInput
                value={item.label}
                onChange={(event) => updateItem({ ...item, label: event.target.value })}
              />
            </Field>
            <Field label="Adres linku">
              <TextInput
                value={item.href}
                onChange={(event) => updateItem({ ...item, href: event.target.value })}
              />
            </Field>
          </FormGrid>
        )}
      />
    </div>
  );
}
