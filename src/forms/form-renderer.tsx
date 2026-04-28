import { Plus, Trash02 } from "@untitledui/icons";
import type { FieldSchema, TemplateSchema } from "./schema";
import { defaultItemFor, getAtPath, listInsert, listRemove, setAtPath } from "./schema";

interface FormRendererProps<T> {
    schema: TemplateSchema;
    value: T;
    onChange: (next: T) => void;
}

export function FormRenderer<T>({ schema, value, onChange }: FormRendererProps<T>) {
    return (
        <div className="flex flex-col gap-5">
            {schema.map((field) => (
                <FieldNode
                    key={field.key}
                    field={field}
                    path={field.key}
                    value={value}
                    onChange={onChange}
                />
            ))}
        </div>
    );
}

interface FieldNodeProps<T> {
    field: FieldSchema;
    path: string;
    value: T;
    onChange: (next: T) => void;
}

function FieldNode<T>({ field, path, value, onChange }: FieldNodeProps<T>) {
    const fieldValue = getAtPath(value, path);

    const setField = (v: unknown) => onChange(setAtPath(value, path, v));

    switch (field.kind) {
        case "text":
            return (
                <Labelled label={field.label} description={field.description} required={field.required}>
                    <input
                        type="text"
                        data-form-path={path}
                        value={(fieldValue as string) ?? ""}
                        onChange={(e) => setField(e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className={inputClass}
                    />
                </Labelled>
            );

        case "textarea":
            return (
                <Labelled label={field.label} description={field.description} required={field.required}>
                    <textarea
                        data-form-path={path}
                        value={(fieldValue as string) ?? ""}
                        onChange={(e) => setField(e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        rows={field.rows ?? 3}
                        className={textareaClass}
                    />
                </Labelled>
            );

        case "select":
            return (
                <Labelled label={field.label} description={field.description} required={field.required}>
                    <select
                        data-form-path={path}
                        value={(fieldValue as string) ?? ""}
                        onChange={(e) => setField(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">—</option>
                        {field.options.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Labelled>
            );

        case "toggle":
            return (
                <label className="flex items-center gap-2 text-sm text-secondary">
                    <input
                        type="checkbox"
                        data-form-path={path}
                        checked={Boolean(fieldValue)}
                        onChange={(e) => setField(e.target.checked)}
                        className="size-4"
                    />
                    <span>{field.label}</span>
                </label>
            );

        case "group":
            return (
                <div className="flex flex-col gap-3 rounded-lg border border-secondary p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                        {field.label}
                    </div>
                    {field.fields.map((sub) => (
                        <FieldNode
                            key={sub.key}
                            field={sub}
                            path={`${path}.${sub.key}`}
                            value={value}
                            onChange={onChange}
                        />
                    ))}
                </div>
            );

        case "list": {
            const list = ((fieldValue as unknown[]) ?? []) as unknown[];
            const canAdd = list.length < field.max;
            const canRemove = list.length > field.min;
            return (
                <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-primary">{field.label}</span>
                            <span className="text-[10px] font-mono text-quaternary">
                                {list.length}/{field.max}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(listInsert(value, path, defaultItemFor(field)))}
                            disabled={!canAdd}
                            className="inline-flex items-center gap-1 rounded-md border border-secondary bg-primary px-2 py-1 text-xs font-medium text-secondary transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus className="size-3" aria-hidden />
                            Add {field.itemLabel.toLowerCase()}
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {list.map((_, i) => (
                            <div key={i} className="relative flex flex-col gap-3 rounded-lg border border-secondary bg-secondary/30 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-quaternary">
                                        {field.itemLabel} {i + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onChange(listRemove(value, path, i))}
                                        disabled={!canRemove}
                                        title={canRemove ? `Remove ${field.itemLabel.toLowerCase()}` : `Minimum ${field.min} required`}
                                        className="inline-flex size-6 items-center justify-center rounded text-tertiary transition hover:bg-primary hover:text-error-primary disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <Trash02 className="size-3.5" aria-hidden />
                                    </button>
                                </div>
                                {field.itemFields.map((sub) => {
                                    /* `$self` means the list item IS the value (string list,
                                     * not list-of-objects). Path skips the inner key. */
                                    const subPath = sub.key === "$self" ? `${path}.${i}` : `${path}.${i}.${sub.key}`;
                                    return (
                                        <FieldNode
                                            key={sub.key}
                                            field={sub}
                                            path={subPath}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }
}

/* defaultItemFor is exported from ./schema so the editor can reuse it
 * when handling preview ghost-add clicks. */

const inputClass =
    "w-full rounded-md border border-secondary bg-primary px-3 py-2 text-sm text-primary outline-none transition focus:border-brand placeholder:text-quaternary";

const textareaClass = inputClass + " resize-y leading-relaxed font-normal";

function Labelled({
    label,
    description,
    required,
    children,
}: {
    label: string;
    description?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="flex items-baseline gap-1.5 text-xs font-medium text-tertiary">
                {label}
                {required && <span className="text-error-primary">*</span>}
            </span>
            {children}
            {description && <span className="text-[11px] text-quaternary">{description}</span>}
        </label>
    );
}
