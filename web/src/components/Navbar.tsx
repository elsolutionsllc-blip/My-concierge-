import { User } from "@supabase/supabase-js";

interface NavbarProps {
    user: User | null;
    isPremium: boolean;
    onLogin: () => void;
    onLogout: () => void;
    onUpgrade: () => void;
}

export function Navbar({ user, isPremium, onLogin, onLogout, onUpgrade }: NavbarProps) {
    return (
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-8 relative z-50">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`h-0.5 w-8 ${isPremium ? 'bg-amber-400' : 'bg-slate-600'}`}></div>
                    <h2 className={`text-xs font-bold tracking-[0.2em] uppercase ${isPremium ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isPremium ? 'Private Access' : 'Public View'}
                    </h2>
                </div>
                <h1 className="text-5xl font-serif text-white tracking-tight">
                    MY CONCIERGE
                </h1>
                <p className="mt-3 text-slate-400 text-lg font-light">
                    The Concierge is <span className="text-amber-400 font-medium animate-pulse">In</span>.
                </p>
            </div>

            <div className="flex flex-col items-end gap-3">
                {/* Live Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
                    </span>
                    <span className="text-xs font-bold text-amber-400 tracking-wider">LIVE INVENTORY</span>
                </div>

                {/* Auth / Upgrade Controls */}
                <div className="flex gap-3">
                    {!user ? (
                        <button
                            onClick={onLogin} // Redirects to /login in actual app logic or prompts modal
                            className="px-6 py-2 rounded-full bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors border border-white/10"
                        >
                            Sign In
                        </button>
                    ) : (
                        <>
                            {!isPremium && (
                                <button
                                    onClick={onUpgrade} // Redirects to /upgrade
                                    className="px-6 py-2 rounded-full bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                                >
                                    Upgrade
                                </button>
                            )}
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 rounded-full bg-slate-800/50 text-slate-400 font-medium text-sm hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
