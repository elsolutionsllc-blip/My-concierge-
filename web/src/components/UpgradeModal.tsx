import { X } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0F172A] border border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.2)] animate-in fade-in zoom-in duration-300">
                <div className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-white" onClick={onClose}>
                    <X className="w-5 h-5" />
                </div>

                <div className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                            <span className="text-3xl">💎</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif text-white mb-2">Unlock Private Access</h2>
                    <p className="text-slate-400 mb-8">
                        Join <span className="text-[#D4AF37] font-bold">My Concierge</span> to view hidden flight gems, panic drops, and exclusive hotel inventory.
                    </p>

                    <button
                        onClick={onUpgrade}
                        className="w-full py-4 bg-[#D4AF37] hover:bg-[#b08d2b] text-black font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5"
                    >
                        Start Membership • $9/mo
                    </button>

                    <p className="mt-4 text-xs text-slate-500">Cancel anytime. Secure checkout via Stripe.</p>
                </div>
            </div>
        </div>
    );
}
