import type { ReactNode } from "react";

/* Stamps a form-path onto whatever it wraps. Renders a <span> with
 * `display: contents` so the element exists in the DOM (queryable via
 * .closest('[data-form-path]')) but does not generate a box of its own —
 * the wrapped children retain their original layout role.
 *
 * Convention: wrap only leaf text-bearing elements. The click handler
 * resolves to the *closest* trace ancestor; nesting works (e.g. a card's
 * outer Trace lets clicks on chrome fall back to the card's first input). */
export function Trace({ path, children }: { path: string; children: ReactNode }) {
    return (
        <span data-form-path={path} style={{ display: "contents" }}>
            {children}
        </span>
    );
}
