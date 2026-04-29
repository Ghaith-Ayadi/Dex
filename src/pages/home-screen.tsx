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

    /* Contextual highlight: click or drag-select in the preview → focus the
     * matching form input, scroll into view, and select the same substring.
     *
     * Path resolution is now deterministic via <Trace> data attributes
     * (no text matching, no duplicates ambiguity, no decorative pollution).
     * Substring selection still uses the rendered text so the user can
     * highlight just a word and have it land in the input.
     *
     * mouseup (not click) so drag-select-and-release-outside still fires. */
    const formContainerRef = useRef<HTMLDivElement>(null);
    const handlePreviewMouseUp = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const targetEl = e.target as HTMLElement | null;
            const traced = targetEl?.closest<HTMLElement>("[data-form-path]");
            const path = traced?.dataset.formPath;
            if (!path) return;

            /* Read the user's drag-selection if any; else use the trace's
             * own textContent as the substring to select in the input. */
            let needle = "";
            const sel = typeof window !== "undefined" ? window.getSelection() : null;
            if (sel && sel.rangeCount > 0) {
                const t = sel.toString().replace(/\s+/g, " ").trim();
                if (t && e.currentTarget.contains(sel.getRangeAt(0).commonAncestorContainer)) {
                    needle = t;
                }
            }
            if (!needle) needle = (traced.textContent ?? "").replace(/\s+/g, " ").trim();

            const root = formContainerRef.current;
            if (!root) return;
            const input = root.querySelector<HTMLElement>(`[data-form-path="${CSS.escape(path)}"]`);
            if (!input) return;
            input.focus({ preventScroll: true });
            input.scrollIntoView({ behavior: "smooth", block: "center" });

            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                const v = input.value ?? "";
                if (v && needle) {
                    const start = v.toLowerCase().indexOf(needle.toLowerCase());
                    if (start >= 0) input.setSelectionRange(start, start + needle.length);
                    else input.select();
                } else if (v) {
                    input.select();
                }
            }
        },
        [],
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
                onMouseUp={handlePreviewMouseUp}
                title="Click any text to focus its input; drag-select to highlight only part"
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
