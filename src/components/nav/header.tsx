import { NavLink } from "react-router";
import { useFlavor } from "@/providers/flavor-provider";

function FlavorToggle() {
    const { flavor, setFlavor } = useFlavor();
    return (
        <div className="flex h-7 items-center gap-px rounded-full border border-secondary bg-secondary/50 p-0.5">
            <button
                type="button"
                onClick={() => setFlavor("basic")}
                className={
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition " +
                    (flavor === "basic"
                        ? "bg-primary text-primary shadow-xs"
                        : "text-tertiary hover:text-primary")
                }
            >
                Basic
            </button>
            <button
                type="button"
                onClick={() => setFlavor("fun")}
                className={
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition " +
                    (flavor === "fun"
                        ? "bg-primary text-primary shadow-xs"
                        : "text-tertiary hover:text-primary")
                }
            >
                Fun
            </button>
        </div>
    );
}

export function NavHeader({ rightSlot }: { rightSlot?: React.ReactNode }) {
    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-secondary bg-primary px-4">
            <div className="flex items-center gap-6">
                <span className="text-md font-semibold text-primary">Dex</span>
                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            "rounded-md px-2.5 py-1 text-sm font-medium transition " +
                            (isActive
                                ? "bg-secondary text-primary"
                                : "text-tertiary hover:text-primary")
                        }
                    >
                        Editor
                    </NavLink>
                    <NavLink
                        to="/templates"
                        className={({ isActive }) =>
                            "rounded-md px-2.5 py-1 text-sm font-medium transition " +
                            (isActive
                                ? "bg-secondary text-primary"
                                : "text-tertiary hover:text-primary")
                        }
                    >
                        Templates
                    </NavLink>
                </nav>
            </div>
            <div className="flex items-center gap-4 text-xs text-tertiary">
                {rightSlot}
                <FlavorToggle />
            </div>
        </header>
    );
}
