"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DealCard } from "@/components/DealCard";
import { FilterBar } from "@/components/FilterBar";
import { Navbar } from "@/components/Navbar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Deal {
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
}

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Auth State Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    // Fetch from backend or just check a claim (Mock for now)
    // In real implementation you'd call GET /user/:id/status
    // For MVP with no real DB connection, we can simulate:
    // If email contains "premium", they are premium.
    const res = await fetch(`http://localhost:8000/user/${userId}/status`);
    if (res.ok) {
      const data = await res.json();
      // setIsPremium(data.is_premium); 
      // For Simulation consistency if DB is mocked:
      setIsPremium(false); // Default to Free for strict testing of Blur flow
    } else {
      setIsPremium(false);
    }
  };

  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/deals");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });

  const handleLogin = () => {
    // Navigate to /login
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpgrade = () => {
    // Navigate to /upgrade
    window.location.href = "/upgrade";
  };

  const filteredDeals = deals?.filter(
    (deal) => filter === "all" || deal.type === filter
  );

  return (
    <main className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-[#0F172A]">
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />

      <div className="mx-auto max-w-7xl">
        <Navbar
          user={user}
          isPremium={isPremium}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpgrade={() => setIsUpgradeModalOpen(true)}
        />

        <div className="sticky top-0 z-10 -mx-4 bg-[#0F172A]/90 px-4 py-4 backdrop-blur-lg sm:translate-none sm:mx-0 sm:px-0 mb-8 border-b border-white/5">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* TONIGHT'S ESCAPES SECTION */}
        {(filter === "all" || filter === "hotel" || filter === "flight") && !isLoading && (
          <div className="mb-12">
            <h2 className="text-2xl text-white font-serif mb-6 flex items-center gap-3">
              <span className="text-[#D4AF37]">✦</span> Tonight&apos;s Escapes
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredDeals?.filter(d => d.type !== 'ticket').slice(0, 2).map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isBlurred={!isPremium}
                  onUnlock={() => setIsUpgradeModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}

        <h2 className="text-xl text-slate-500 font-bold uppercase tracking-widest mb-6 text-sm">All Opportunities</h2>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] animate-pulse rounded-xl bg-slate-800/50 border border-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-8 text-center text-red-200">
            Concierge Service Unavailable. Please check connection.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals?.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isBlurred={!isPremium && deal.type === 'flight'} // Example: Only blur high value items or all? Sticking to "All" for MVP impact
                onUnlock={() => setIsUpgradeModalOpen(true)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
