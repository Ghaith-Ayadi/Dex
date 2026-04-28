import { useCallback, useMemo, useRef, useState } from "react";
import { NavHeader } from "@/components/nav/header";
import { SplitPane } from "@/components/split-pane/split-pane";
import { FormRenderer } from "@/forms/form-renderer";
import { defaultItemFor, findListField, firstInputPathFor, getAtPath, listInsert } from "@/forms/schema";
import { SCHEMAS } from "@/forms/schemas";
import { TEMPLATES } from "@/templates";
import { ScaledSlide } from "@/templates/_primitives";

function clone<T>(v: T): T {
    return JSON.parse(JSON.stringify(v));
}

/* Build a Map<normalized-text, form-path> by walking the props tree.
 * Used to map preview clicks back to form fields. */
function walkProps(obj: unknown, path = "", out: Map<string, string> = new Map()): Map<string, string> {
    if (typeof obj === "string") {
        const key = obj.toLowerCase().replace(/\s+/g, " ").trim();
        if (key && !out.has(key)) out.set(key, path);
        return out;
    }
    if (Array.isArray(obj)) {
        obj.forEach((item, i) => walkProps(item, path ? `${path}.${i}` : String(i), out));
        return out;
    }
    if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj)) {
            walkProps(v, path ? `${path}.${k}` : k, out);
        }
    }
    return out;
}

export const HomeScreen = () => {
    const [selectedId, setSelectedId] = useState<string>(TEMPLATES[0].id);
    const selected = useMemo(
        () => TEMPLATES.find((t) => t.id === selectedId) ?? TEMPLATES[0],
        [selectedId],
    );
    const [formProps, setFormProps] = useState<Record<string, unknown>>(() =>
        clone(selected.canonical) as Record<string, unknown>,
    );

    const schema = SCHEMAS[selected.id];

    const handleSelect = (id: string) => {
        const t = TEMPLATES.find((x) => x.id === id);
        if (!t) return;
        setSelectedId(id);
        setFormProps(clone(t.canonical) as Record<string, unknown>);
    };

    const Component = selected.component;

    /* Handler injected into the rendered template so its <AddGhostSlot> can
     * trigger an item insert at the corresponding form path. After insert,
     * focuses the first input of the new item and selects its placeholder
     * text so the user can replace it with the first keystroke. */
    const handleAddItem = useCallback(
        (path: string) => {
            if (!schema) return;
            const field = findListField(schema, path);
            if (!field) return;
            const list = (getAtPath(formProps, path) as unknown[]) ?? [];
            if (list.length >= field.max) return;
            const newIndex = list.length;
            const item = defaultItemFor(field);
            setFormProps((prev) => listInsert(prev, path, item));

            /* Wait for React to commit the new field, then focus + select. */
            const focusPath = firstInputPathFor(field, path, newIndex);
            if (!focusPath) return;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const root = formContainerRef.current;
                    if (!root) return;
                    const input = root.querySelector<HTMLElement>(`[data-form-path="${CSS.escape(focusPath)}"]`);
                    if (!input) return;
                    input.scrollIntoView({ behavior: "smooth", block: "center" });
                    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                        input.focus();
                        input.select();
                    } else {
                        input.focus();
                    }
                });
            });
        },
        [schema, formProps],
    );

    /* Click (or drag-select) in preview → focus matching form input,
     * scroll into view, and select the matching substring inside the input.
     * If the user dragged to highlight a substring (e.g. just "title" out of
     * "my awesome slide title"), use that substring instead of the full text
     * of the clicked element. */
    const formContainerRef = useRef<HTMLDivElement>(null);
    const handlePreviewClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            let text = "";

            const sel = typeof window !== "undefined" ? window.getSelection() : null;
            if (sel && sel.rangeCount > 0) {
                const selectedText = sel.toString().replace(/\s+/g, " ").trim();
                if (selectedText) {
                    const range = sel.getRangeAt(0);
                    if (e.currentTarget.contains(range.commonAncestorContainer)) {
                        text = selectedText;
                    }
                }
            }

            if (!text) {
                let el = e.target as HTMLElement | null;
                while (el && el !== e.currentTarget) {
                    const t = (el.textContent ?? "").replace(/\s+/g, " ").trim();
                    if (t && t.length <= 200) {
                        text = t;
                        break;
                    }
                    el = el.parentElement;
                }
            }
            if (!text) return;

            const map = walkProps(formProps);
            const key = text.toLowerCase();

            let path = map.get(key);
            if (!path) {
                /* Try prefix matches both ways for cases where the rendered
                 * element wraps the value (e.g. quote glyphs ahead of text). */
                for (const [k, p] of map) {
                    if (k.length >= 6 && (k.startsWith(key) || key.startsWith(k))) {
                        path = p;
                        break;
                    }
                }
            }
            if (!path) return;

            const root = formContainerRef.current;
            if (!root) return;
            const input = root.querySelector<HTMLElement>(`[data-form-path="${CSS.escape(path)}"]`);
            if (!input) return;
            input.focus({ preventScroll: true });
            input.scrollIntoView({ behavior: "smooth", block: "center" });

            /* Also select the matching substring inside the input so the
             * user can immediately overwrite the clicked text. */
            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                const v = input.value ?? "";
                if (v) {
                    const start = v.toLowerCase().indexOf(text.toLowerCase());
                    if (start >= 0) input.setSelectionRange(start, start + text.length);
                    else input.select();
                }
            }
        },
        [formProps],
    );

    const editorPane = (
        <section className="flex h-full min-h-0 flex-col bg-primary">
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-secondary px-4">
                <span className="text-xs font-medium uppercase tracking-wide text-tertiary">inputs</span>
                <span className="text-[10px] text-quaternary">{selected.id}</span>
            </div>
            <div ref={formContainerRef} className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {schema ? (
                        <FormRenderer
                            schema={schema}
                            value={formProps}
                            onChange={setFormProps}
                        />
                    ) : (
                        <p className="text-sm text-tertiary">
                            No schema defined for <code>{selected.id}</code>.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );

    const previewPane = (
        <section className="flex h-full min-h-0 flex-col bg-secondary">
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-secondary bg-primary px-4">
                <span className="text-xs font-medium uppercase tracking-wide text-tertiary">slide preview</span>
                <span className="text-[10px] text-quaternary">{selected.id}</span>
            </div>
            <div
                className="flex-1 p-8 min-h-0 cursor-pointer"
                onClick={handlePreviewClick}
                title="Click any text to focus its input"
            >
                <ScaledSlide>
                    <Component {...(formProps as object)} _onAdd={handleAddItem} />
                </ScaledSlide>
            </div>
        </section>
    );

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-primary">
            <NavHeader rightSlot={<span>{selected.id}</span>} />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <aside className="flex w-[260px] shrink-0 flex-col border-r border-secondary bg-primary overflow-hidden">
                    <div className="flex h-9 shrink-0 items-center border-b border-secondary px-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-tertiary">templates</span>
                    </div>
                    <ul className="flex flex-col gap-px overflow-y-auto p-2">
                        {TEMPLATES.map((t) => (
                            <li key={t.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(t.id)}
                                    className={
                                        "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition " +
                                        (t.id === selectedId
                                            ? "bg-secondary text-primary"
                                            : "text-secondary hover:bg-secondary/60 hover:text-primary")
                                    }
                                >
                                    <span className="truncate">{t.name}</span>
                                    <span className="shrink-0 font-mono text-[10px] text-quaternary">{t.category}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="min-w-0 flex-1">
                    <SplitPane
                        left={editorPane}
                        right={previewPane}
                        initialSplit={42}
                        min={20}
                        max={75}
                        storageKey="dex.editor.split"
                    />
                </div>
            </div>
        </div>
    );
};
