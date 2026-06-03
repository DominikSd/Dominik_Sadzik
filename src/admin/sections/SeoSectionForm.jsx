import React from "react";
import { Field, TextArea, TextInput } from "./FormPrimitives";

export default function SeoSectionForm({ value, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Meta title" hint="Najlepiej do około 60-70 znaków.">
        <TextInput
          value={value.metaTitle}
          onChange={(event) => onChange({ ...value, metaTitle: event.target.value })}
        />
      </Field>
      <Field label="Meta description" hint="Krótki opis dla wyszukiwarek.">
        <TextArea
          value={value.metaDescription}
          onChange={(event) => onChange({ ...value, metaDescription: event.target.value })}
        />
      </Field>
    </div>
  );
}
