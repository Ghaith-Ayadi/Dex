import { NavHeader } from "@/components/nav/header";

export const TestBench = () => {
    return (
        <div className="flex h-dvh flex-col bg-primary">
            <NavHeader rightSlot={<span>thesis test · 54 slides</span>} />
            <iframe
                src="/test-bench/index.html"
                title="Dex thesis test — slides ↔ markdown"
                className="flex-1 w-full border-0 bg-primary"
            />
        </div>
    );
};
