import { useEffect, useRef } from "react";

/* PreviewCaretOverlay — mirrors the focused form input's caret/selection
 * onto the slide preview as a blinking caret or translucent selection rects.
 *
 * Cheap on purpose: writes only to refs; no React state in the keystroke
 * hot path. The overlay's position is updated on every `selectionchange`
 * (and `input`) event, debounced via requestAnimationFrame. Updates use
 * `transform: translate()` only — composited, no layout pass.
 */

export function PreviewCaretOverlay({
    slideRootRef,
    formRootRef,
}: {
    slideRootRef: React.RefObject<HTMLElement | null>;
    formRootRef: React.RefObject<HTMLElement | null>;
}) {
    const caretRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId = 0;

        const hideAll = () => {
            const c = caretRef.current;
            if (c) c.style.opacity = "0";
            const s = selectionRef.current;
            if (s) s.replaceChildren();
        };

        const showCaret = (rect: DOMRect) => {
            const c = caretRef.current;
            if (!c) return;
            c.style.opacity = "1";
            const height = rect.height || 20;
            c.style.height = `${height}px`;
            c.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
        };

        const showSelection = (rects: DOMRect[]) => {
            const container = selectionRef.current;
            if (!container) return;
            // Reuse / grow / shrink rects pool to avoid GC churn.
            while (container.children.length < rects.length) {
                const div = document.createElement("div");
                div.style.position = "fixed";
                div.style.top = "0";
                div.style.left = "0";
                div.style.pointerEvents = "none";
                div.style.background = "var(--color-fg-brand-secondary, #f97316)";
                div.style.opacity = "0.25";
                div.style.borderRadius = "2px";
                container.appendChild(div);
            }
            while (container.children.length > rects.length) {
                container.removeChild(container.lastChild!);
            }
            rects.forEach((rect, i) => {
                const div = container.children[i] as HTMLDivElement;
                div.style.width = `${rect.width}px`;
                div.style.height = `${rect.height}px`;
                div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            });
        };

        const update = () => {
            const slide = slideRootRef.current;
            const form = formRootRef.current;
            if (!slide || !form) {
                hideAll();
                return;
            }

            const active = document.activeElement;
            if (!active || !form.contains(active)) {
                hideAll();
                return;
            }
            if (!(active instanceof HTMLInputElement) && !(active instanceof HTMLTextAreaElement)) {
                hideAll();
                return;
            }

            const path = active.dataset.formPath;
            if (!path) {
                hideAll();
                return;
            }
            const trace = slide.querySelector<HTMLElement>(`[data-form-path="${CSS.escape(path)}"]`);
            if (!trace) {
                hideAll();
                return;
            }

            const start = active.selectionStart ?? 0;
            const end = active.selectionEnd ?? 0;

            if (start === end) {
                const rect = rectAtOffset(trace, start);
                if (!rect) {
                    hideAll();
                    return;
                }
                showCaret(rect);
                showSelection([]);
            } else {
                const rects = rectsForRange(trace, start, end);
                if (rects.length === 0) {
                    hideAll();
                    return;
                }
                const c = caretRef.current;
                if (c) c.style.opacity = "0";
                showSelection(rects);
            }
        };

        const schedule = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(update);
        };

        document.addEventListener("selectionchange", schedule);
        document.addEventListener("focusin", schedule);
        document.addEventListener("focusout", schedule);
        document.addEventListener("input", schedule, true);
        window.addEventListener("resize", schedule);

        const ro = new ResizeObserver(schedule);
        if (slideRootRef.current) ro.observe(slideRootRef.current);

        schedule();

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener("selectionchange", schedule);
            document.removeEventListener("focusin", schedule);
            document.removeEventListener("focusout", schedule);
            document.removeEventListener("input", schedule, true);
            window.removeEventListener("resize", schedule);
            ro.disconnect();
        };
    }, [slideRootRef, formRootRef]);

    return (
        <>
            <div
                ref={caretRef}
                className="animate-caret-blink pointer-events-none fixed top-0 left-0 z-50"
                style={{
                    width: "1.5px",
                    background: "currentColor",
                    color: "var(--color-text-primary)",
                    opacity: 0,
                    willChange: "transform",
                }}
            />
            <div
                ref={selectionRef}
                className="pointer-events-none fixed top-0 left-0 z-40"
                style={{ willChange: "contents" }}
            />
        </>
    );
}

/* Walk text nodes inside `root` to find the visual rect at a character
 * offset. Returns the bounding rect of a 0-length range at that offset
 * (i.e. where a caret would sit). */
function rectAtOffset(root: HTMLElement, offset: number): DOMRect | null {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let remaining = offset;
    let node = walker.nextNode();
    let lastNode: Node | null = null;
    let lastLen = 0;
    while (node) {
        const len = (node.textContent ?? "").length;
        if (remaining <= len) {
            const range = document.createRange();
            range.setStart(node, remaining);
            range.setEnd(node, remaining);
            const rect = range.getBoundingClientRect();
            // Caret-only ranges sometimes return 0-rect; pad height from font
            if (rect.height === 0 && node.parentElement) {
                const parentRect = node.parentElement.getBoundingClientRect();
                return new DOMRect(rect.left, parentRect.top, 0, parentRect.height);
            }
            return rect;
        }
        remaining -= len;
        lastNode = node;
        lastLen = len;
        node = walker.nextNode();
    }
    /* Past end: place caret at end of last node */
    if (lastNode) {
        const range = document.createRange();
        range.setStart(lastNode, lastLen);
        range.setEnd(lastNode, lastLen);
        return range.getBoundingClientRect();
    }
    return null;
}

/* Walk text nodes to find one or more rects spanning offsets [start, end). */
function rectsForRange(root: HTMLElement, start: number, end: number): DOMRect[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let acc = 0;
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;
    let node = walker.nextNode();
    while (node) {
        const len = (node.textContent ?? "").length;
        if (!startNode && start <= acc + len) {
            startNode = node;
            startOffset = Math.max(0, start - acc);
        }
        if (end <= acc + len) {
            endNode = node;
            endOffset = Math.max(0, end - acc);
            break;
        }
        acc += len;
        node = walker.nextNode();
    }
    if (!startNode || !endNode) return [];
    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    return Array.from(range.getClientRects());
}
