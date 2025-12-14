"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DealCard } from "@/components/DealCard";
import { FilterBar } from "@/components/FilterBar";
import { Navbar } from "@/components/Navbar";
import { UpgradeModal } from "@/components/UpgradeModal";
import { getSupabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

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
    const sb = getSupabase();
    sb.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      }
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event: any, session: any) => {
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
    // For MVP - just set as free user
    setIsPremium(false);
  };

  const { data: deals, isLoading, error } = useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: async () => {
      // Mock data - no API call needed
      const mockDeals: Deal[] = [
        {
          id: "1",
          type: "flight",
          title: "NYC to LA Flight",
          old_price: 450,
          new_price: 299,
          drop_percentage: 33,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
          description: "Round trip economy",
          panic_score: 95,
          visual_tag: "Hot Deal"
        },
        {
          id: "2",
          type: "hotel",
          title: "Luxury Resort in Bali",
          old_price: 320,
          new_price: 189,
          drop_percentage: 41,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1586368899136-1b179786357b?w=500&h=300&fit=crop",
          description: "5-star beachfront",
          panic_score: 88,
          visual_tag: "Flash Sale"
        },
        {
          id: "3",
          type: "flight",
          title: "London to Paris Flight",
          old_price: 250,
          new_price: 120,
          drop_percentage: 52,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop",
          description: "Direct flight",
          panic_score: 92,
          visual_tag: "Incredible"
        },
        {
          id: "4",
          type: "hotel",
          title: "Miami Beach Hotel",
          old_price: 280,
          new_price: 155,
          drop_percentage: 44,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1565073225503-7f41e4995d25?w=500&h=300&fit=crop",
          description: "Oceanfront 4-star",
          panic_score: 85,
          visual_tag: "Limited Time"
        },
        {
          id: "5",
          type: "ticket",
          title: "Taylor Swift Concert",
          old_price: 350,
          new_price: 199,
          drop_percentage: 43,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
          description: "Front row seats",
          panic_score: 98,
          visual_tag: "VIP Access"
        },
        {
          id: "6",
          type: "flight",
          title: "Tokyo from SF",
          old_price: 650,
          new_price: 425,
          drop_percentage: 35,
          url: "https://example.com",
          image_url: "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=500&h=300&fit=crop",
          description: "Business class upgrade",
          panic_score: 90,
          visual_tag: "Premium"
        }
      ];
      return mockDeals;
    },
  });

  const handleLogin = () => {
    // Navigate to /login
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
  };

  const handleUpgrade = () => {
    // Navigate to /upgrade
    window.location.href = "/upgrade";
  };

  const filteredDeals = deals?.filter(
    (deal) => filter === "all" || deal.type === filter
  );

  return (
    <main className="min-h-screen bg-black">
      {/* Luxe gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-black to-slate-900 -z-10" />
      <div className="fixed inset-0 opacity-40 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(0,0,0,0))]" />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Navbar
          user={user}
          isPremium={isPremium}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpgrade={() => setIsUpgradeModalOpen(true)}
        />

        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 -mx-4 px-4 py-4 mb-12 border-b border-white/5 sm:mx-0 sm:px-0">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* TONIGHT'S ESCAPES SECTION */}
        {(filter === "all" || filter === "hotel" || filter === "flight") && !isLoading && (
          <div className="mb-16">
            <h2 className="text-4xl text-white font-light mb-2 tracking-tight">
              Tonight&apos;s Escapes
            </h2>
            <p className="text-sm text-amber-400/60 mb-8 font-light">Curated luxury experiences</p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
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

        <div className="mb-8">
          <h2 className="text-xl text-white/80 font-light uppercase tracking-[0.2em] text-sm">All Opportunities</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] animate-pulse rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-12 text-center backdrop-blur-xl">
            <p className="text-amber-400/80 font-light">Concierge Service Unavailable</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals?.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isBlurred={!isPremium && deal.type === 'flight'}
                onUnlock={() => setIsUpgradeModalOpen(true)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

