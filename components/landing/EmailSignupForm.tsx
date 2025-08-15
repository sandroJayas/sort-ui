"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setEmailError(null);
      setIsSubmitting(true);

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
      if (!emailOk) {
        setEmailError("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (!response.ok) throw new Error("Failed to initiate signup");

        const data = await response.json();
        if (data?.authUrl) {
          window.location.href = data.authUrl;
        }
      } catch (err) {
        setEmailError("Something went wrong. Please try again.");
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
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full h-14 sm:h-16 bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 text-base sm:text-lg font-bold focus:border-[#F8B24E] transition-colors"
          required
          disabled={isSubmitting}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <p
            id="email-error"
            className="text-[#F8B24E] text-sm mt-2 animate-fade-in"
          >
            {emailError}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-14 sm:h-16 px-8 sm:px-12 bg-[#F8B24E] text-[#0F1A7D] hover:bg-[#F5A02C] font-black text-base sm:text-lg shadow-[8px_8px_0px_rgba(255,255,255,0.1)] sm:shadow-[10px_10px_0px_rgba(255,255,255,0.1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "PROCESSING..." : "CLAIM SPACE"}
        {!isSubmitting && (
          <ArrowUpRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
        )}
      </Button>
    </form>
  );
}
