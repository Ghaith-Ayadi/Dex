import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cx } from "@/utils/cx";

/* Native slide dimensions — every slide renders at this exact size,
 * then ScaledSlide visually scales it to fit the available space. */
export const SLIDE_W = 1280;
export const SLIDE_H = 720;

export function Slide({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
    return (
        <div
            style={{ width: SLIDE_W, height: SLIDE_H }}
            className={cx(
                "relative shrink-0 overflow-hidden bg-primary text-primary",
                "flex flex-col",
                padded && "p-20",
                className,
            )}
        >
            {children}
        </div>
    );
}

/* Wraps a Slide and scales it to fit the parent container while preserving
 * 16:9. Uses transform: scale + transform-origin: top-left, then sizes the
 * outer wrapper to the scaled dimensions so flex/grid containers behave. */
export function ScaledSlide({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            if (w === 0 || h === 0) return;
            const s = Math.min(w / SLIDE_W, h / SLIDE_H);
            setScale(s);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cx(
                "relative flex h-full w-full items-center justify-center overflow-hidden",
                className,
            )}
        >
            <div
                className="overflow-hidden rounded-2xl border border-secondary bg-primary shadow-sm"
                style={{
                    width: SLIDE_W * scale,
                    height: SLIDE_H * scale,
                    visibility: scale > 0 ? "visible" : "hidden",
                }}
            >
                <div
                    style={{
                        width: SLIDE_W,
                        height: SLIDE_H,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cx("text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary", className)}>
            {children}
        </div>
    );
}

export function Title({ children, size = "lg", className }: { children: ReactNode; size?: "md" | "lg" | "xl" | "2xl"; className?: string }) {
    const sizeMap = {
        md: "text-display-md",
        lg: "text-display-lg",
        xl: "text-display-xl",
        "2xl": "text-display-2xl",
    };
    return (
        <h1 className={cx(sizeMap[size], "font-semibold tracking-tight text-primary", className)}>
            {children}
        </h1>
    );
}

export function Subtitle({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cx("text-xl leading-relaxed text-tertiary max-w-3xl", className)}>
            {children}
        </p>
    );
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cx("text-md leading-relaxed text-tertiary", className)}>
            {children}
        </p>
    );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cx("text-sm font-medium text-quaternary", className)}>
            {children}
        </div>
    );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cx("inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand bg-primary text-xs font-semibold text-brand-secondary", className)}>
            {children}
        </span>
    );
}
