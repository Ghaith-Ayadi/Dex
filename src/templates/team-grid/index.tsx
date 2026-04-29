import { AddGhostSlot, Slide, Kicker, Title, Trace } from "../_primitives";

export type TeamMember = {
    name: string;
    role: string;
    bio?: string;
    initials?: string;
};

export type TeamGridProps = {
    kicker?: string;
    title: string;
    members: TeamMember[];
    _onAdd?: (path: string) => void;
};

function makeInitials(name: string): string {
    const parts = name.split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

const AVATAR_BG = ["bg-brand-primary", "bg-secondary", "bg-tertiary"];

export default function TeamGrid({ kicker, title, members, _onAdd }: TeamGridProps) {
    const cols = members.length <= 3 ? members.length : members.length === 4 ? 2 : 4;
    return (
        <Slide>
            <div className="flex max-w-3xl flex-col gap-4">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div
                className="group/ghost mt-10 grid flex-1 gap-6 content-start"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {members.map((m, i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-2xl border border-secondary bg-primary p-6">
                        <div
                            className={
                                "flex size-14 items-center justify-center rounded-full text-md font-semibold tracking-tight " +
                                (i === 0 ? "bg-brand-primary text-brand-secondary" : "bg-secondary text-secondary")
                            }
                        >
                            {m.initials ?? makeInitials(m.name)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Trace path={`members.${i}.name`}>
                                <h3 className="text-md font-semibold text-primary">{m.name}</h3>
                            </Trace>
                            <Trace path={`members.${i}.role`}>
                                <p className="text-xs font-medium uppercase tracking-wider text-brand-secondary">{m.role}</p>
                            </Trace>
                        </div>
                        {m.bio && (
                            <Trace path={`members.${i}.bio`}>
                                <p className="text-sm leading-relaxed text-tertiary">{m.bio}</p>
                            </Trace>
                        )}
                    </div>
                ))}
                <AddGhostSlot path="members" onAdd={_onAdd} className="min-h-[180px]" />
            </div>
        </Slide>
    );
}

export const canonical: TeamGridProps = {
    kicker: "The team",
    title: "Who's building Dex",
    members: [
        { name: "Ghaith Ayadi", role: "Founder, Design", bio: "Presentation design lead at Axoniq. RISD-shaped instincts, 15 years of decks." },
        { name: "TBD", role: "Founding Engineer", bio: "Full-stack TS, taste for systems work. The role we're hiring for now." },
        { name: "TBD", role: "Design Engineer", bio: "Lives in the seam between Figma and React. Comfortable with both." },
    ],
};
