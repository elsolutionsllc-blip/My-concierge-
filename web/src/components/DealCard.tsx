import { ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealCardProps {
    deal: {
        id: string;
        type: "ticket" | "flight" | "hotel";
        title: string;
        old_price: number;
        new_price: number;
        drop_percentage: number;
        url: string;
        image_url?: string;
        description?: string;
        deal_score?: number;
        visual_tag?: string;
    };
    isBlurred?: boolean;
    onUnlock?: () => void;
}

export function DealCard({ deal, isBlurred = false, onUnlock }: DealCardProps) {
    const isHot = deal.drop_percentage > 20 || (deal.deal_score && deal.deal_score > 90);

    return (
        <div
            onClick={isBlurred ? onUnlock : undefined}
            className={cn(
                "group relative block overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-md border transition-all duration-300",
                isBlurred
                    ? "cursor-pointer border-slate-800 hover:border-slate-700"
                    : "border-white/10 hover:border-amber-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]"
            )}
        >
            <div className="aspect-[16/9] w-full relative overflow-hidden">
                {deal.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={deal.image_url}
                        alt={deal.title}
                        className={cn(
                            "h-full w-full object-cover transition-transform duration-700",
                            !isBlurred && "group-hover:scale-110 opacity-90 group-hover:opacity-100",
                            isBlurred && "blur-sm opacity-40 scale-105"
                        )}
                    />
                ) : (
                    <div className="h-full w-full bg-slate-900 flex items-center justify-center text-slate-600">
                        No Image
                    </div>
                )}

                {/* Badges - Only visible if not blurred or partially visible? Let's show type even if blurred */}
                <div className="absolute top-2 right-2 flex gap-2">
                    {!isBlurred && deal.visual_tag && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                            {deal.visual_tag}
                        </span>
                    )}

                    {isHot && !isBlurred && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-lg border border-red-400/30">
                            🔥 PANIC DROP
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-amber-400/30">
                        {deal.type.toUpperCase()}
                    </span>
                </div>

                {/* Lock Overlay for Free Users */}
                {isBlurred && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="bg-amber-400 p-3 rounded-full mb-2 shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-pulse">
                            <Lock className="w-6 h-6 text-black" />
                        </div>
                        <span className="font-bold text-white uppercase tracking-widest text-sm drop-shadow-md">Unlock Access</span>
                    </div>
                )}
            </div>

            <div className={cn("p-5 relative", isBlurred && "blur-[2px] select-none")}>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 tracking-wide">
                    {isBlurred ? "Hidden Concierge Pick" : deal.title}
                </h3>
                {deal.description && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{deal.description}</p>
                )}

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 line-through mb-0.5">${deal.old_price.toFixed(0)}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-amber-400">${deal.new_price.toFixed(0)}</span>
                            {!isBlurred && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    -{deal.drop_percentage}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold group-hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                        {isBlurred ? <Lock className="h-4 w-4" /> : <ExternalLink className="h-5 w-5" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
