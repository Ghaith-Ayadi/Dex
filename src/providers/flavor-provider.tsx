import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Flavor = "basic" | "fun";

interface FlavorContextValue {
    flavor: Flavor;
    setFlavor: (flavor: Flavor) => void;
    toggle: () => void;
}

const STORAGE_KEY = "dex.flavor";

const FlavorContext = createContext<FlavorContextValue | undefined>(undefined);

export function useFlavor(): FlavorContextValue {
    const ctx = useContext(FlavorContext);
    if (!ctx) throw new Error("useFlavor must be used within FlavorProvider");
    return ctx;
}

export function FlavorProvider({ children, defaultFlavor = "basic" }: { children: ReactNode; defaultFlavor?: Flavor }) {
    const [flavor, setFlavorState] = useState<Flavor>(() => {
        if (typeof window === "undefined") return defaultFlavor;
        const saved = window.localStorage.getItem(STORAGE_KEY) as Flavor | null;
        return saved === "fun" || saved === "basic" ? saved : defaultFlavor;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (flavor === "fun") {
            root.setAttribute("data-flavor", "fun");
        } else {
            root.removeAttribute("data-flavor");
        }
        window.localStorage.setItem(STORAGE_KEY, flavor);
    }, [flavor]);

    const setFlavor = (f: Flavor) => setFlavorState(f);
    const toggle = () => setFlavorState((f) => (f === "fun" ? "basic" : "fun"));

    return (
        <FlavorContext.Provider value={{ flavor, setFlavor, toggle }}>
            {children}
        </FlavorContext.Provider>
    );
}
