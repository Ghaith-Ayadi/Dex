import { Check, X } from "@untitledui/icons";
import { Slide, Kicker, Title, Trace } from "../_primitives";

export type ComparisonRow = {
    label: string;
    values: (string | boolean)[];
};

export type ComparisonTableProps = {
    kicker?: string;
    title: string;
    columns: string[];
    rows: ComparisonRow[];
    highlightColumn?: number;
};

function renderCell(value: string | boolean) {
    if (value === true) return <Check className="size-5 text-brand-secondary" aria-hidden />;
    if (value === false) return <X className="size-5 text-quaternary opacity-40" aria-hidden />;
    return <span className="text-sm text-secondary">{value}</span>;
}

export default function ComparisonTable({ kicker, title, columns, rows, highlightColumn }: ComparisonTableProps) {
    return (
        <Slide>
            <div className="flex flex-col gap-4 max-w-3xl">
                {kicker && <Trace path="kicker"><Kicker>{kicker}</Kicker></Trace>}
                <Trace path="title"><Title size="md">{title}</Title></Trace>
            </div>
            <div className="mt-8 overflow-hidden rounded-xl border border-secondary">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-secondary bg-secondary/50">
                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-quaternary">Feature</th>
                            {columns.map((c, i) => (
                                <th
                                    key={i}
                                    className={
                                        "px-5 py-3 text-xs font-semibold uppercase tracking-wider " +
                                        (highlightColumn === i ? "bg-brand-primary text-brand-secondary" : "text-quaternary")
                                    }
                                >
                                    <Trace path={`columns.${i}`}>
                                        <span>{c}</span>
                                    </Trace>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b border-secondary last:border-0">
                                <td className="px-5 py-3 text-sm font-medium text-secondary">
                                    <Trace path={`rows.${i}.label`}>
                                        <span>{row.label}</span>
                                    </Trace>
                                </td>
                                {row.values.map((v, j) => (
                                    <td
                                        key={j}
                                        className={
                                            "px-5 py-3 text-center " +
                                            (highlightColumn === j ? "bg-brand-primary" : "")
                                        }
                                    >
                                        <Trace path={`rows.${i}.values.${j}`}>
                                            <span>{renderCell(v)}</span>
                                        </Trace>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Slide>
    );
}

export const canonical: ComparisonTableProps = {
    kicker: "Detailed comparison",
    title: "What you get at each tier",
    columns: ["Free", "Pro", "Enterprise"],
    highlightColumn: 1,
    rows: [
        { label: "Decks", values: ["5", "Unlimited", "Unlimited"] },
        { label: "Templates", values: ["50 starter", "Full library", "Full + custom"] },
        { label: "Collaborators", values: ["1", "5", "Unlimited"] },
        { label: "Custom templates", values: [false, true, true] },
        { label: "Brand kit lock", values: [false, false, true] },
        { label: "SSO + SCIM", values: [false, false, true] },
        { label: "Audit logs", values: [false, false, true] },
    ],
};
