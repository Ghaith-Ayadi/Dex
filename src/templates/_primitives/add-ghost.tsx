import { Plus } from "@untitledui/icons";
import { cx } from "@/utils/cx";

/* A clickable "+" placeholder that templates render at the end of a list.
 * Hidden by default; appears when the parent (a `group/ghost` element) is
 * hovered. Clicking it asks the editor to insert a new item.
 *
 * Convention:
 *   <div className="group/ghost flex gap-4">     <- list container
 *     {items.map(...)}                            <- existing items
 *     <AddGhostSlot path="cards" onAdd={onAdd} ... />
 *   </div>
 *
 * `path` is the form-path of the list (e.g. "cards", "tiers", "events").
 * `onAdd` is supplied by the editor at render time. If not supplied, the
 * ghost renders nothing — keeps the gallery clean. */
export function AddGhostSlot({
    path,
    onAdd,
    label = "Add",
    className,
}: {
    path: string;
    onAdd?: (path: string) => void;
    label?: string;
    className?: string;
}) {
    if (!onAdd) return null;
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onAdd(path);
            }}
            aria-label={label}
            className={cx(
                "group/ghost-btn relative flex items-center justify-center rounded-2xl border-2 border-dashed border-secondary text-quaternary transition",
                "opacity-0 pointer-events-none",
                "group-hover/ghost:opacity-100 group-hover/ghost:pointer-events-auto",
                "hover:border-brand hover:text-brand-secondary hover:bg-brand-primary/30",
                "focus:opacity-100 focus:pointer-events-auto focus:outline-2 focus:outline-brand focus:outline-offset-2",
                className,
            )}
        >
            <Plus className="size-6" aria-hidden />
        </button>
    );
}
