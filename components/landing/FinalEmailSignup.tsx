"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FinalEmailSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Failed to submit");

        const data = await response.json();
        if (data?.authUrl) {
          window.location.href = data.authUrl;
        }
      } catch (err) {
        setError("Something went wrong. Please try again. " + err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email],
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full h-14 sm:h-16 bg-white/90 border-2 border-[#0F1A7D] text-[#0F1A7D] placeholder:text-[#0F1A7D]/50 text-base sm:text-lg font-bold mb-4 focus:bg-white transition-colors"
        required
        disabled={isSubmitting}
      />
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 sm:h-16 bg-[#0F1A7D] text-white hover:bg-[#1724B6] font-black text-base sm:text-lg shadow-[0_8px_0px_rgba(15,26,125,0.3)] hover:translate-y-[-2px] hover:shadow-[0_10px_0px_rgba(15,26,125,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "PROCESSING..." : "CLAIM YOUR SPACE NOW"}
      </Button>
    </form>
  );
}
