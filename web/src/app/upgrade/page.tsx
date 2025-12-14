"use client";

import { Check } from "lucide-react";

export default function Upgrade() {
    const features = [
        "Instant Panic Alerts",
        "Hidden Mistake Fares",
        "Concierge Support",
        "Priority Booking",
        "Ad-Free Experience"
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">

                <div className="space-y-6">
                    <h1 className="text-5xl font-serif text-white leading-tight">
                        Upgrade your <br />
                        <span className="text-amber-400">Lifestyle.</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Stop browsing. Start traveling. Join the club that finds the deals before they disappear.
                    </p>
                    <div className="flex flex-col gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-slate-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-md border border-amber-400/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                        BEST VALUE
                    </div>

                    <div className="mb-8">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Concierge Access</h3>
                        <div className="flex items-end gap-1">
                            <span className="text-5xl font-bold text-white">$9</span>
                            <span className="text-slate-500 mb-1">/month</span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-amber-400/20 mb-4">
                        Unlock Access
                    </button>

                    <p className="text-center text-xs text-slate-500">
                        Secure payment via Stripe. Cancel anytime.
                    </p>
                </div>

            </div>
        </div>
    );
}
