"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Info, Shield, Smartphone } from "lucide-react";
import Link from "next/link";

export default function SecuritySettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkMFAStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/auth/mfa/status");
      if (response.ok) {
        const data = await response.json();
        setMfaStatus(data.enabled);
      }
    } catch (error) {
      console.error("Failed to check MFA status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Check MFA status on component mount
  useEffect(() => {
    checkMFAStatus();
  }, []);

  const handleEnableMFA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mfa/enable", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Auth0 MFA enrollment
        window.location.href = data.mfaUrl;
      } else {
        throw new Error("Failed to enable MFA");
      }
    } catch (error) {
      console.error("MFA enable error:", error);
      alert("Failed to enable two-factor authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    if (
      !confirm(
        "Are you sure you want to disable two-factor authentication? This will make your account less secure.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mfa/disable", {
        method: "POST",
      });

      if (response.ok) {
        setMfaStatus(false);
        alert("Two-factor authentication has been disabled.");
      } else {
        throw new Error("Failed to disable MFA");
      }
    } catch (error) {
      console.error("MFA disable error:", error);
      alert("Failed to disable two-factor authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Two-Factor Authentication Card */}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </div>
          {!isChecking && mfaStatus !== null && (
            <Badge variant={mfaStatus ? "default" : "secondary"}>
              {mfaStatus ? "Enabled" : "Disabled"}
            </Badge>
          )}
        </div>
        {isChecking ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Checking security status...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-4 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="mfa-toggle" className="text-base font-normal">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app to generate verification codes
                </p>
              </div>
              <Switch
                id="mfa-toggle"
                checked={mfaStatus || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleEnableMFA();
                  } else {
                    handleDisableMFA();
                  }
                }}
                disabled={isLoading}
              />
            </div>

            {mfaStatus ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Two-factor authentication is active</AlertTitle>
                <AlertDescription>
                  Your account is protected with an additional security layer.
                  You&#39;ll need your authenticator app to sign in.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Enhance your security</AlertTitle>
                <AlertDescription>
                  Two-factor authentication helps protect your account from
                  unauthorized access, even if someone knows your password.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">How it works:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Download an authenticator app (Google Authenticator, Authy,
                  etc.)
                </li>
                <li>Scan the QR code shown during setup</li>
                <li>Enter the 6-digit code from your app when signing in</li>
              </ul>
            </div>
          </>
        )}

        {/* Additional Security Options */}
        <div className="flex items-center justify-between py-8  border-t">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-sm text-muted-foreground">Last changed: Never</p>
          </div>
          <Link href="#">
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
