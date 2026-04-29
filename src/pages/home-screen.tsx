import { useCallback, useMemo, useRef, useState } from "react";
import { NavHeader } from "@/components/nav/header";
import { PreviewCaretOverlay } from "@/components/preview-caret";
import { SplitPane } from "@/components/split-pane/split-pane";
import { FormRenderer } from "@/forms/form-renderer";
import { defaultItemFor, findListField, firstInputPathFor, getAtPath, listInsert } from "@/forms/schema";
import { SCHEMAS } from "@/forms/schemas";
import { TEMPLATES } from "@/templates";
import { ScaledSlide } from "@/templates/_primitives";

function clone<T>(v: T): T {
    return JSON.parse(JSON.stringify(v));
}

/* Compute the character offset within `root` corresponding to a DOM
 * (container, offsetInContainer) tuple. Uses Range.toString() so it
 * handles both text-node and element-node containers correctly. */
function offsetWithin(root: HTMLElement, container: Node, offsetInContainer: number): number {
    if (!root.contains(container) && container !== root) return 0;
    const range = document.createRange();
    range.setStart(root, 0);
    try {
        range.setEnd(container, offsetInContainer);
    } catch {
        return 0;
    }
    return range.toString().length;
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

    /* Contextual highlight: click in preview = caret at exact offset in
     * input (no select-all). Drag-select = mirrored range. Both stay in
     * sync via PreviewCaretOverlay observing the input's selection state.
     *
     * Path resolution: e.target.closest('[data-form-path]'). Offsets are
     * computed via Range.toString().length on the trace element. */
    const formContainerRef = useRef<HTMLDivElement>(null);
    const slideRootRef = useRef<HTMLDivElement>(null);

    const handlePreviewMouseUp = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const targetEl = e.target as HTMLElement | null;
            const traced = targetEl?.closest<HTMLElement>("[data-form-path]");
            const path = traced?.dataset.formPath;
            if (!path) return;

            let start = 0;
            let end = 0;
            const sel = typeof window !== "undefined" ? window.getSelection() : null;
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                if (traced.contains(range.startContainer)) {
                    start = offsetWithin(traced, range.startContainer, range.startOffset);
                }
                if (traced.contains(range.endContainer)) {
                    end = offsetWithin(traced, range.endContainer, range.endOffset);
                } else {
                    end = start;
                }
            }

            const root = formContainerRef.current;
            if (!root) return;
            const input = root.querySelector<HTMLElement>(`[data-form-path="${CSS.escape(path)}"]`);
            if (!input) return;
            input.scrollIntoView({ behavior: "smooth", block: "center" });
            input.focus({ preventScroll: true });

            if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                const valueLen = (input.value ?? "").length;
                const lo = Math.max(0, Math.min(valueLen, Math.min(start, end)));
                const hi = Math.max(0, Math.min(valueLen, Math.max(start, end)));
                input.setSelectionRange(lo, hi);
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
                ref={slideRootRef}
                className="flex-1 p-8 min-h-0"
                onMouseUp={handlePreviewMouseUp}
                title="Click any text to place a cursor; drag to select"
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

            <PreviewCaretOverlay slideRootRef={slideRootRef} formRootRef={formContainerRef} />
        </div>
    );
};
