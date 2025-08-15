"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 max-w-xl"
    >
      <div className="flex-1">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full h-14 sm:h-16 bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 text-base sm:text-lg font-bold focus:border-[#F8B24E] transition-colors"
          required
          disabled={isSubmitting}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error && (
          <p id="email-error" className="text-[#F8B24E] text-sm mt-2">
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-14 sm:h-16 px-8 sm:px-12 bg-[#F8B24E] text-[#0F1A7D] hover:bg-[#F5A02C] font-black text-base sm:text-lg shadow-[8px_8px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_rgba(255,255,255,0.15)] disabled:opacity-50"
      >
        {isSubmitting ? "PROCESSING..." : "CLAIM SPACE"}
        {!isSubmitting && (
          <ArrowUpRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
        )}
      </Button>
    </form>
  );
}
