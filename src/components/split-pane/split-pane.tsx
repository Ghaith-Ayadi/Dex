import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

/* Horizontal resizable split. Stores split as a percentage 20–80.
 * Drag the divider to resize. */
export function SplitPane({
    left,
    right,
    initialSplit = 50,
    min = 20,
    max = 80,
    storageKey,
    className,
}: {
    left: ReactNode;
    right: ReactNode;
    initialSplit?: number;
    min?: number;
    max?: number;
    storageKey?: string;
    className?: string;
}) {
    const [split, setSplit] = useState<number>(() => {
        if (storageKey && typeof window !== "undefined") {
            const saved = window.localStorage.getItem(storageKey);
            if (saved) {
                const n = Number(saved);
                if (!Number.isNaN(n) && n >= min && n <= max) return n;
            }
        }
        return initialSplit;
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);

    useEffect(() => {
        if (storageKey) window.localStorage.setItem(storageKey, String(split));
    }, [split, storageKey]);

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            draggingRef.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [],
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!draggingRef.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            setSplit(Math.max(min, Math.min(max, pct)));
        },
        [min, max],
    );

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        draggingRef.current = false;
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }, []);

    return (
        <div ref={containerRef} className={cx("flex h-full w-full", className)}>
            <div style={{ width: `${split}%` }} className="min-w-0 min-h-0 h-full overflow-hidden">
                {left}
            </div>
            <div
                role="separator"
                aria-orientation="vertical"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="group relative flex w-1 shrink-0 cursor-col-resize items-center justify-center bg-border-secondary transition hover:bg-border-primary"
            >
                <div className="absolute inset-y-0 -inset-x-1.5" />
            </div>
            <div style={{ width: `${100 - split}%` }} className="min-w-0 min-h-0 h-full overflow-hidden">
                {right}
            </div>
        </div>
    );
}
