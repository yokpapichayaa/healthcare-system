import type { FieldConfig, FormSection } from "@/types/patient";

export const FORM_SECTIONS: FormSection[] = [
  {
    title: "Personal Information",
    icon: "person",
    fields: [
      { key: "firstName",   label: "First Name",   type: "text",   required: true,  half: true },
      { key: "lastName",    label: "Last Name",     type: "text",   required: true,  half: true },
      { key: "middleName",  label: "Middle Name",   type: "text",   required: false, half: true },
      { key: "dob",         label: "Date of Birth", type: "date",   required: true,  half: true },
      { key: "gender",      label: "Gender",        type: "select", required: true,  half: true,
        options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
      { key: "nationality", label: "Nationality",   type: "text",   required: true,  half: true },
    ],
  },
  {
    title: "Contact Details",
    icon: "contact",
    fields: [
      { key: "phone",    label: "Phone Number",       type: "tel",      required: true,  half: true },
      { key: "email",    label: "Email Address",      type: "email",    required: true,  half: true },
      { key: "address",  label: "Address",            type: "textarea", required: true,  half: false },
      { key: "language", label: "Preferred Language", type: "text",     required: true,  half: false },
    ],
  },
  {
    title: "Emergency & Other",
    icon: "shield",
    fields: [
      { key: "emergencyName",     label: "Emergency Contact", type: "text", required: false, half: true },
      { key: "emergencyRelation", label: "Relationship",      type: "text", required: false, half: true },
      { key: "religion",          label: "Religion",          type: "text", required: false, half: true },
    ],
  },
];

export const ALL_FIELDS: FieldConfig[] = FORM_SECTIONS.flatMap(s => s.fields);
export const REQUIRED_FIELD_KEYS = ALL_FIELDS.filter(f => f.required).map(f => f.key);

export const PUSHER_CHANNEL = "patient-forms";
export const PUSHER_EVENT   = "form-update";
