/* Form schema for template inputs. Each template declares one of these
 * to drive a generated form in the editor's left pane.
 *
 * Stays simple on purpose: text, textarea, group (one nested object),
 * list (repeating items with min/max). No conditionals, no dynamic
 * dependencies — by design. If a template's input shape can't be
 * expressed here, that's a signal the template is overcomplicated. */

export type FieldSchema =
    | TextField
    | TextareaField
    | SelectField
    | ToggleField
    | GroupField
    | ListField;

export interface CommonField {
    key: string;
    label: string;
    description?: string;
    required?: boolean;
}

export interface TextField extends CommonField {
    kind: "text";
    placeholder?: string;
    maxLength?: number;
}

export interface TextareaField extends CommonField {
    kind: "textarea";
    placeholder?: string;
    maxLength?: number;
    rows?: number;
}

export interface SelectField extends CommonField {
    kind: "select";
    options: { value: string; label: string }[];
}

export interface ToggleField extends CommonField {
    kind: "toggle";
}

export interface GroupField extends CommonField {
    kind: "group";
    fields: FieldSchema[];
}

export interface ListField extends CommonField {
    kind: "list";
    itemLabel: string; // singular noun: "Card", "Step", "Tier"
    min: number;
    max: number;
    itemFields: FieldSchema[];
    /* Optional default for newly added items */
    defaultItem?: () => Record<string, unknown>;
}

export type TemplateSchema = FieldSchema[];

/* Read a value from props at a key path like "cards.0.heading". */
export function getAtPath(obj: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, k) => {
        if (acc == null) return undefined;
        if (Array.isArray(acc)) return acc[Number(k)];
        if (typeof acc === "object") return (acc as Record<string, unknown>)[k];
        return undefined;
    }, obj);
}

/* Immutably set a value at a key path. */
export function setAtPath<T>(obj: T, path: string, value: unknown): T {
    const parts = path.split(".");
    if (parts.length === 0) return obj;

    const recur = (curr: unknown, idx: number): unknown => {
        const key = parts[idx];
        const last = idx === parts.length - 1;

        if (Array.isArray(curr) || /^\d+$/.test(key)) {
            const arr = Array.isArray(curr) ? [...curr] : [];
            const n = Number(key);
            arr[n] = last ? value : recur(arr[n], idx + 1);
            return arr;
        }

        const o = (curr && typeof curr === "object") ? { ...(curr as Record<string, unknown>) } : {};
        o[key] = last ? value : recur(o[key], idx + 1);
        return o;
    };

    return recur(obj, 0) as T;
}

/* Insert/remove for a list at a path. */
export function listInsert<T>(obj: T, path: string, item: unknown, atIndex?: number): T {
    const list = (getAtPath(obj, path) as unknown[]) ?? [];
    const next = [...list];
    if (atIndex == null || atIndex >= next.length) next.push(item);
    else next.splice(atIndex, 0, item);
    return setAtPath(obj, path, next);
}

export function listRemove<T>(obj: T, path: string, index: number): T {
    const list = (getAtPath(obj, path) as unknown[]) ?? [];
    const next = list.filter((_, i) => i !== index);
    return setAtPath(obj, path, next);
}

/* Build a sensible default for one new list item, given the list's schema. */
export function defaultItemFor(field: ListField): unknown {
    if (field.defaultItem) return field.defaultItem();
    if (
        field.itemFields.length === 1 &&
        field.itemFields[0].kind !== "group" &&
        field.itemFields[0].kind !== "list" &&
        field.itemFields[0].key === "$self"
    ) {
        const k = field.itemFields[0].kind;
        if (k === "toggle") return false;
        return "";
    }
    const obj: Record<string, unknown> = {};
    for (const f of field.itemFields) {
        if (f.key === "$self") continue;
        if (f.kind === "text" || f.kind === "textarea" || f.kind === "select") obj[f.key] = "";
        else if (f.kind === "toggle") obj[f.key] = false;
        else if (f.kind === "list") obj[f.key] = [];
        else if (f.kind === "group") obj[f.key] = {};
    }
    return obj;
}

/* Walk a TemplateSchema to find the ListField at a given dotted path
 * (numeric segments descend into list itemFields). */
export function findListField(schema: TemplateSchema, path: string): ListField | null {
    const parts = path.split(".");
    let fields: FieldSchema[] = schema;
    let current: FieldSchema | null = null;

    for (const part of parts) {
        if (/^\d+$/.test(part)) {
            if (current?.kind !== "list") return null;
            fields = current.itemFields;
            current = null;
            continue;
        }
        const next = fields.find((f) => f.key === part);
        if (!next) return null;
        current = next;
        if (next.kind === "group") fields = next.fields;
    }

    return current?.kind === "list" ? current : null;
}
