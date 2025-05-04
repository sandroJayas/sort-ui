"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function VerificationAlert() {
  return (
    <Alert className="flex items-center justify-between bg-red-100 border-0 rounded-none">
      <div className="flex flex-col md:flex-row container mx-auto px-4 max-w-6xl justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-2 flex-1 break-words">
          <AlertCircle className="text-red-600 shrink-0" />
          <AlertTitle className="tracking-wide break-words overflow-visible">
            To access Sort&#39;s full features, please complete your profile
            details first.
          </AlertTitle>
        </div>
        <Link
          href="/profile/personal-information"
          className={"w-full md:w-auto mt-2 md:mt-0"}
        >
          <Button
            size="lg"
            className="text-destructive-foreground hover:bg-destructive/60 bg-red-600 text-white w-full md:w-auto"
          >
            Update profile
          </Button>
        </Link>
      </div>
    </Alert>
  );
}
