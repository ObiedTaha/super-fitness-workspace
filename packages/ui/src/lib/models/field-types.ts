import { Observable } from 'rxjs';

/** Name of one of the inline SVG glyphs rendered by `FieldIcon`. */
export type FieldIconName =
  | 'email'
  | 'lock'
  | 'user'
  | 'phone'
  | 'calendar'
  | 'ruler'
  | 'weight'
  | 'target'
  | 'activity'
  | 'gender'
  | 'eye'
  | 'eye-off'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'upload'
  | 'image'
  | 'close';

export type FormMode = 'create' | 'update';

export interface SelectOption {
  label: string;
  value: string | number | boolean | null;
}

/** Props every field shares, whatever its `type`. */
interface BaseFieldConfig {
  /** Unique key. Doubles as the model property and the submitted payload key. */
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  /**
   * Fields sharing a `row` are laid out side by side in a grid.
   * Defaults to the field index, i.e. one field per row.
   */
  row?: number;
  /** Modes in which this field is not rendered at all. */
  hiddenIn?: FormMode[];
  /** Rendered but stripped from the payload on submit (e.g. `rePassword`). */
  excludeFromSubmit?: boolean;
  /** Derives this field's value from two other fields. */
  computedFrom?: {
    fields: [string, string];
    formula: (a: number, b: number) => number;
  };
  /** Leading glyph drawn inside the control. */
  icon?: FieldIconName;
  /** Native autocomplete hint, e.g. 'email', 'given-name', 'new-password'. */
  autocomplete?: string;
  /**
   * Keeps the label for screen readers and validation messages but hides it
   * visually, for placeholder-only designs.
   */
  hideLabel?: boolean;
  /**
   * Extra validation on top of `required`. Return a message to reject the
   * value, or `null` to accept it. Receives the whole model so a field can
   * check another (e.g. a password confirmation).
   *
   * Only runs once the field is non-empty; `required` covers the empty case.
   */
  validate?: (value: unknown, model: Record<string, unknown>) => string | null;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'number' | 'date';
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: 'password';
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
}

export interface UploadFieldConfig extends BaseFieldConfig {
  type: 'upload';
  multiple?: boolean;
  accept?: string;
  /** Per-file limit in bytes, handed straight to p-fileupload. */
  maxFileSize?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | PasswordFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | UploadFieldConfig;

export type FieldType = FieldConfig['type'];

/** Uploads one file and resolves to the stored URL. */
export type FileUploadFn = (file: File) => Observable<string>;
