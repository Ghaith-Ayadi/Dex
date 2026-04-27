import { NavHeader } from "@/components/nav/header";
import { TEMPLATES } from "@/templates";
import { ScaledSlide } from "@/templates/_primitives";

export const TemplateGallery = () => {
    return (
        <div className="min-h-dvh bg-secondary">
            <NavHeader rightSlot={<span>{TEMPLATES.length} templates</span>} />

            <main className="mx-auto max-w-[1600px] px-8 py-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    {TEMPLATES.map((t) => {
                        const Component = t.component;
                        return (
                            <section key={t.id} className="flex flex-col gap-3">
                                <header className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-3">
                                        <h2 className="text-md font-semibold text-primary">{t.name}</h2>
                                        <code className="text-xs text-tertiary font-mono">{t.id}</code>
                                    </div>
                                    <span className="text-xs uppercase tracking-wider text-quaternary">{t.category}</span>
                                </header>
                                <div className="aspect-[16/9] w-full">
                                    <ScaledSlide>
                                        <Component {...t.canonical} />
                                    </ScaledSlide>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};
