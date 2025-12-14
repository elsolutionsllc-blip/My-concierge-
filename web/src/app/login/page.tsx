"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                <h1 className="text-3xl font-serif text-white mb-2">MY CONCIERGE</h1>
                <p className="text-slate-400 mb-8">Sign in to unlock private inventory.</p>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? "Connecting..." : "Continue with Google"}
                </button>

                <p className="mt-8 text-xs text-slate-600">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
