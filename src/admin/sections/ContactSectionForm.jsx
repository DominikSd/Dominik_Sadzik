import { Field, FormGrid, TextArea, TextInput } from "./FormPrimitives";

export default function ContactSectionForm({ value, onChange }) {
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
      <Field label="Opis">
        <TextArea value={value.text} onChange={(event) => update({ text: event.target.value })} />
      </Field>
      <FormGrid>
        <Field label="Telefon">
          <TextInput
            value={value.phone}
            onChange={(event) => update({ phone: event.target.value })}
          />
        </Field>
        <Field label="Email">
          <TextInput
            value={value.email}
            onChange={(event) => update({ email: event.target.value })}
          />
        </Field>
        <Field label="Adres / lokalizacja">
          <TextInput
            value={value.address}
            onChange={(event) => update({ address: event.target.value })}
          />
        </Field>
        <Field label="Adres WWW">
          <TextInput value={value.www} onChange={(event) => update({ www: event.target.value })} />
        </Field>
        <Field label="Tekst przycisku email">
          <TextInput
            value={value.emailButtonLabel}
            onChange={(event) => update({ emailButtonLabel: event.target.value })}
          />
        </Field>
        <Field label="Tekst przycisku telefonu">
          <TextInput
            value={value.phoneButtonLabel}
            onChange={(event) => update({ phoneButtonLabel: event.target.value })}
          />
        </Field>
      </FormGrid>
    </div>
  );
}
