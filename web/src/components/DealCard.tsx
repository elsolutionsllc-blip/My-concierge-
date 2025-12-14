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
                "group relative block overflow-hidden rounded-2xl transition-all duration-500",
                "backdrop-blur-xl border",
                isBlurred
                    ? "cursor-pointer bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                    : "bg-white/8 border-white/15 hover:border-amber-400/50 hover:bg-white/12 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-[1.02]"
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
                            !isBlurred && "group-hover:scale-110 opacity-85 group-hover:opacity-95",
                            isBlurred && "blur-md opacity-30 scale-105"
                        )}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/40">
                        Premium Experience
                    </div>
                )}

                {/* Dark overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {!isBlurred && deal.visual_tag && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-xl px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
                            {deal.visual_tag}
                        </span>
                    )}

                    {isHot && !isBlurred && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 backdrop-blur-xl px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-400/40">
                            🔥 PANIC
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-xl px-3 py-1.5 text-xs font-semibold text-amber-400 border border-amber-400/30">
                        {deal.type.toUpperCase()}
                    </span>
                </div>

                {/* Lock Overlay for Free Users */}
                {isBlurred && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40">
                        <div className="bg-amber-400 p-4 rounded-full mb-3 backdrop-blur-xl border border-amber-300/30">
                            <Lock className="w-6 h-6 text-black" />
                        </div>
                        <span className="font-semibold text-white uppercase tracking-wider text-sm">Unlock Access</span>
                    </div>
                )}
            </div>

            <div className={cn("p-6 relative", isBlurred && "blur-sm select-none")}>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 tracking-tight">
                    {isBlurred ? "Hidden Concierge Pick" : deal.title}
                </h3>
                {deal.description && (
                    <p className="text-sm text-white/60 mb-4 line-clamp-2 font-light">{deal.description}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-xs text-white/50 line-through mb-1 font-light">${deal.old_price.toFixed(0)}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-light text-amber-400">${deal.new_price.toFixed(0)}</span>
                            {!isBlurred && (
                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/30 backdrop-blur-sm">
                                    -{deal.drop_percentage}%
                                </span>
                            )}
                        </div>
                    </div>
                    <button className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-black font-semibold group-hover:from-amber-300 group-hover:to-amber-400 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95">
                        {isBlurred ? <Lock className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
