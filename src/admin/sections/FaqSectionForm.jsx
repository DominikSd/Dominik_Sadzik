import { Field, FormGrid, ListEditor, TextArea, TextInput } from "./FormPrimitives";

export default function FaqSectionForm({ value, onChange }) {
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
      <ListEditor
        items={value.items}
        onChange={(items) => update({ items })}
        createItem={() => ({ question: "Nowe pytanie", answer: "Odpowiedz" })}
        addLabel="Dodaj pytanie"
        renderItem={(item, index, updateItem) => (
          <div className="space-y-4">
            <Field label={`Pytanie ${index + 1}`}>
              <TextInput
                value={item.question}
                onChange={(event) => updateItem({ ...item, question: event.target.value })}
              />
            </Field>
            <Field label="Odpowiedz">
              <TextArea
                value={item.answer}
                onChange={(event) => updateItem({ ...item, answer: event.target.value })}
              />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
