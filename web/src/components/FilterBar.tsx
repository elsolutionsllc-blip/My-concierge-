import { cn } from "@/lib/utils";

interface FilterBarProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
}

const filters = [
    { id: "all", label: "All" },
    { id: "ticket", label: "Sports" },
    { id: "flight", label: "Flights" },
    { id: "hotel", label: "Hotels" },
];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 whitespace-nowrap tracking-wide border",
                        currentFilter === filter.id
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                            : "bg-slate-800/50 text-slate-400 border-white/5 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                    )}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
