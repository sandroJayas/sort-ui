// app/subscription/page.tsx
"use client";

import React, { useCallback, useMemo, memo } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Check,
  AlertCircle,
  Calendar,
  Package,
  ArrowRight,
  Shield,
  RefreshCw,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { DashboardNavbar } from "@/components/shared/Navbar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { VerificationAlert } from "@/components/shared/VerificationAlert";
import Container from "@/components/shared/Container";
import { useUser } from "@/hooks/useUser";
import { isUserValid } from "@/lib/utils";

import { useSubscription } from "@/hooks/subscription/useSubscription";
import { useCreateCheckoutSession } from "@/hooks/subscription/useCreateCheckoutSession";
import { useReactivateSubscription } from "@/hooks/subscription/useReactivateSubscription";
import { useCreateBillingPortal } from "@/hooks/subscription/useCreateBillingPortal";
import { useCancelSubscription } from "@/hooks/subscription/useCancelSubscription";
import { CreateCheckoutSessionRequest } from "@/types/subscription";

// Types
interface LoadingStateProps {
  text?: string;
}

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

interface PricingPlan {
  id: string;
  priceId?: string;
  title: string;
  description: string;
  price: string;
  period: string;
  billedText?: string;
  features: string[];
  isFeatured?: boolean;
  badge?: string;
  isCustom?: boolean;
}

interface PricingCardProps extends PricingPlan {
  onSubscribe: (priceId?: string) => void;
  isLoading: boolean;
  isVerified: boolean;
}

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
}

interface SubscriptionStatusBadgeProps {
  status: string;
}

interface BillingPeriodProps {
  startDate: string;
  endDate: string;
}

interface PlanDetailRowProps {
  label: string;
  value: string | number;
  formatCurrency?: boolean;
}

// Memoized Components
const LoadingState = memo<LoadingStateProps>(({ text = "Loading..." }) => (
  <div
    className="flex items-center justify-center py-16"
    role="status"
    aria-live="polite"
  >
    <LoadingSpinner size="lg" text={text} />
  </div>
));
LoadingState.displayName = "LoadingState";

const ErrorState = memo<ErrorStateProps>(({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16" role="alert">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-10 h-10 text-red-500" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
      {error.message || "We couldn't load your subscription. Please try again."}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1742B1] text-white rounded-lg font-medium text-sm hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:ring-offset-2"
        aria-label="Retry loading subscription"
      >
        Try Again
      </button>
    )}
  </div>
));
ErrorState.displayName = "ErrorState";

const SubscriptionStatusBadge = memo<SubscriptionStatusBadgeProps>(
  ({ status }) => {
    const badgeClasses = useMemo(() => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-700";
        case "trialing":
          return "bg-blue-100 text-blue-700";
        case "cancelled":
        case "incomplete":
        case "incomplete_expired":
          return "bg-red-100 text-red-700";
        case "past_due":
          return "bg-yellow-100 text-yellow-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }, [status]);

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${badgeClasses}`}
        role="status"
        aria-label={`Subscription status: ${status}`}
      >
        {status}
      </span>
    );
  },
);
SubscriptionStatusBadge.displayName = "SubscriptionStatusBadge";

const PlanDetailRow = memo<PlanDetailRowProps>(
  ({ label, value, formatCurrency = false }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {formatCurrency && typeof value === "number"
          ? `$${(value / 100).toFixed(2)}`
          : value}
      </span>
    </div>
  ),
);
PlanDetailRow.displayName = "PlanDetailRow";

const BillingPeriod = memo<BillingPeriodProps>(({ startDate, endDate }) => {
  const formattedDates = useMemo(
    () => ({
      start: new Date(startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      end: new Date(endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }),
    [startDate, endDate],
  );

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-[#1742B1]" aria-hidden="true" />
        <div>
          <p className="text-sm text-gray-600">Current Period</p>
          <p className="font-semibold text-gray-900">
            <time dateTime={startDate}>{formattedDates.start}</time>
            {" - "}
            <time dateTime={endDate}>{formattedDates.end}</time>
          </p>
        </div>
      </div>
    </div>
  );
});
BillingPeriod.displayName = "BillingPeriod";

const StatCard = memo<StatCardProps>(({ icon: Icon, value, label }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <Icon className="w-8 h-8 text-[#1742B1]" aria-hidden="true" />
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  </div>
));
StatCard.displayName = "StatCard";

const PricingCard = memo<PricingCardProps>(
  ({
    priceId,
    title,
    description,
    price,
    period,
    features,
    onSubscribe,
    isLoading,
    isVerified,
    isFeatured = false,
    badge,
    billedText,
    isCustom = false,
  }) => {
    const handleClick = useCallback(() => {
      if (!isCustom) {
        onSubscribe(priceId);
      } else {
        window.location.href = "mailto:alan@sortinvite.com";
      }
    }, [priceId, onSubscribe, isCustom]);

    return (
      <article
        className={`bg-white rounded-xl border ${isFeatured ? "border-[#1742B1] shadow-lg relative" : "border-gray-100 shadow-sm"}`}
        aria-label={`${title} pricing plan`}
      >
        {badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#FF9900] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
              {badge}
            </span>
          </div>
        )}
        <div className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </header>

          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#1742B1]">{price}</span>
              {!isCustom && (
                <span className="text-gray-500 ml-2">/{period}</span>
              )}
            </div>
            {billedText && (
              <p className="text-xs text-gray-500 mt-1">{billedText}</p>
            )}
          </div>

          <ul className="space-y-3 mb-6" role="list">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check
                  className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleClick}
            disabled={isLoading || !isVerified}
            className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isFeatured
                ? "bg-[#1742B1] text-white hover:bg-[#14399F] hover:shadow-lg hover:shadow-[#1742B1]/25 focus:ring-[#1742B1]/20"
                : "bg-white border border-[#1742B1] text-[#1742B1] hover:bg-gray-50 focus:ring-[#1742B1]/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={`Select ${title} plan`}
          >
            {isLoading && !isCustom
              ? "Loading..."
              : isCustom
                ? "Contact Sales"
                : `Choose ${title}`}
          </button>
        </div>
      </article>
    );
  },
);
PricingCard.displayName = "PricingCard";

// Main Component
export default function SubscriptionPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: subscription, isLoading, error, refetch } = useSubscription();
  const { mutate: createCheckout, isPending: isCreatingCheckout } =
    useCreateCheckoutSession();
  const { mutate: cancelSubscription, isPending: isCancelling } =
    useCancelSubscription();
  const { mutate: reactivateSubscription, isPending: isReactivating } =
    useReactivateSubscription();
  const { mutate: openBillingPortal, isPending: isOpeningPortal } =
    useCreateBillingPortal();

  const isVerified = useMemo(() => isUserValid(user), [user]);

  // Pricing plans configuration
  const pricingPlans: PricingPlan[] = useMemo(
    () => [
      {
        id: "monthly",
        priceId: "price_annual",
        title: "5x5 storage",
        description: "20% lower than competitors",
        price: "$55",
        period: "month",
        billedText: "Pay month by month",
        features: [
          "Unlimited returns",
          "Unlimited drop offs",
          "Priority support",
          "Cancel any time",
        ],
        isFeatured: true,
        badge: "Best Value",
      },
    ],
    [],
  );

  const handleSubscribe = useCallback(() => {
    const request: CreateCheckoutSessionRequest = {
      price_id: "price_1RspPSC6hQJyjDODxrvUCXI9",
    };

    createCheckout(request, {
      onSuccess: (data) => {
        window.location.href = data.checkout_url;
      },
      onError: (error) => {
        toast.error("Checkout Error", {
          description: error.message || "Failed to create checkout session",
        });
      },
    });
  }, [createCheckout]);

  const handleCancel = useCallback(() => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.",
    );

    if (!confirmed) return;

    cancelSubscription(undefined, {
      onSuccess: () => {
        toast.success("Subscription Cancelled", {
          description:
            "Your subscription will end at the end of the billing period",
        });
        refetch();
      },
      onError: (error) => {
        toast.error("Cancellation Error", {
          description: error.message || "Failed to cancel subscription",
        });
      },
    });
  }, [cancelSubscription, refetch]);

  const handleReactivate = useCallback(() => {
    reactivateSubscription(undefined, {
      onSuccess: () => {
        toast.success("Subscription Reactivated", {
          description: "Your subscription has been reactivated",
        });
        refetch();
      },
      onError: (error) => {
        toast.error("Reactivation Error", {
          description: error.message || "Failed to reactivate subscription",
        });
      },
    });
  }, [reactivateSubscription, refetch]);

  const handleManageBilling = useCallback(() => {
    openBillingPortal(
      {},
      {
        onError: (error) => {
          toast.error("Portal Error", {
            description: error.message || "Failed to open billing portal",
          });
        },
      },
    );
  }, [openBillingPortal]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Usage stats (would come from API in real app)
  const usageStats = useMemo(
    () => [
      { icon: Package, value: 12, label: "Boxes Stored" },
      { icon: ArrowRight, value: 3, label: "Deliveries" },
      { icon: RefreshCw, value: 2, label: "Returns" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1742B1] text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <DashboardNavbar />

      {!isVerified && !isUserLoading && <VerificationAlert />}

      <main id="main-content" role="main" aria-label="Subscription management">
        <Container>
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Subscription
            </h1>
            <p className="text-gray-600">
              Manage your Sort storage subscription and billing
            </p>
          </header>

          {isLoading ? (
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <LoadingState text="Loading subscription..." />
            </section>
          ) : error ? (
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <ErrorState error={error} onRetry={handleRetry} />
            </section>
          ) : !subscription || subscription.status === "cancelled" ? (
            /* No Subscription - Pricing Section */
            <div className="space-y-6">
              {/* Hero Card */}
              <section
                className="bg-white rounded-xl border border-gray-100 shadow-sm"
                aria-labelledby="hero-title"
              >
                <div className="p-8 text-center">
                  <Shield
                    className="w-16 h-16 text-[#1742B1] mx-auto mb-6"
                    aria-hidden="true"
                  />
                  <h2
                    id="hero-title"
                    className="text-2xl font-bold text-gray-900 mb-3"
                  >
                    One Plan. 5’×5’ Space.
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Simple, transparent pricing: $55/month for your own 5’×5’
                    space. Free returns, climate-controlled storage, cancel
                    anytime.
                  </p>
                </div>
              </section>

              {/* Pricing Cards */}
              <section aria-labelledby="pricing-title">
                <h2 id="pricing-title" className="sr-only">
                  Pricing Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPlans.map((plan) => (
                    <PricingCard
                      key={plan.id}
                      {...plan}
                      isVerified={isVerified}
                      onSubscribe={handleSubscribe}
                      isLoading={isCreatingCheckout}
                    />
                  ))}
                </div>
              </section>

              {/* Features Section */}
              <section
                className="bg-white rounded-xl border border-gray-100 shadow-sm"
                aria-labelledby="features-title"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2
                    id="features-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Why Choose Sort Storage?
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Package
                        className="w-12 h-12 text-[#1742B1] mx-auto mb-4"
                        aria-hidden="true"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Easy drop off
                      </h3>
                      <p className="text-sm text-gray-600">
                        Schedule a drop off in seconds
                      </p>
                    </div>
                    <div className="text-center">
                      <Shield
                        className="w-12 h-12 text-[#1742B1] mx-auto mb-4"
                        aria-hidden="true"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Secure & Climate Controlled
                      </h3>
                      <p className="text-sm text-gray-600">
                        Your items are safe in our monitored facilities
                      </p>
                    </div>
                    <div className="text-center">
                      <RefreshCw
                        className="w-12 h-12 text-[#1742B1] mx-auto mb-4"
                        aria-hidden="true"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Easy Returns
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get your items back whenever you need them
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* Active Subscription */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Plan Card */}
                <section
                  className="bg-white rounded-xl border border-gray-100 shadow-sm"
                  aria-labelledby="current-plan-title"
                >
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2
                        id="current-plan-title"
                        className="text-base font-semibold text-gray-900"
                      >
                        Current Plan
                      </h2>
                      <SubscriptionStatusBadge status={subscription.status} />
                    </div>
                  </div>

                  <div className="p-6">
                    {subscription.plan_details && (
                      <div className="space-y-4">
                        <PlanDetailRow
                          label="Plan Name"
                          value={subscription.plan_details.name}
                        />
                        <PlanDetailRow
                          label="Billing Amount"
                          value={`${(subscription.plan_details.amount / 100).toFixed(2)} ${subscription.plan_details.currency.toUpperCase()}`}
                        />
                        <PlanDetailRow
                          label="Billing Cycle"
                          value={`${subscription.plan_details.interval}ly`}
                        />
                      </div>
                    )}

                    <BillingPeriod
                      startDate={subscription.current_period_start}
                      endDate={subscription.current_period_end}
                    />

                    {/* Cancellation Warning */}
                    {subscription.cancel_at_period_end && (
                      <div
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                        role="alert"
                      >
                        <div className="flex items-start space-x-3">
                          <AlertCircle
                            className="w-5 h-5 text-red-600 mt-0.5"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="font-semibold text-red-900">
                              Subscription Ending
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              Your subscription will end on{" "}
                              <time dateTime={subscription.current_period_end}>
                                {new Date(
                                  subscription.current_period_end,
                                ).toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Usage Stats */}
                <section
                  className="bg-white rounded-xl border border-gray-100 shadow-sm"
                  aria-labelledby="usage-title"
                >
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2
                      id="usage-title"
                      className="text-base font-semibold text-gray-900"
                    >
                      Storage Usage
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {usageStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Quick Actions */}
                <section
                  className="bg-white rounded-xl border border-gray-100 shadow-sm"
                  aria-labelledby="actions-title"
                >
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3
                      id="actions-title"
                      className="text-base font-semibold text-gray-900"
                    >
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={handleManageBilling}
                      disabled={isOpeningPortal}
                      className="w-full px-4 py-2.5 bg-white border border-[#1742B1] text-[#1742B1] rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      aria-label="Open billing portal"
                    >
                      <CreditCard className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isOpeningPortal ? "Opening..." : "Manage Billing"}
                      </span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </button>

                    {subscription.cancel_at_period_end ? (
                      <button
                        onClick={handleReactivate}
                        disabled={isReactivating}
                        className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Reactivate subscription"
                      >
                        {isReactivating
                          ? "Reactivating..."
                          : "Reactivate Subscription"}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="w-full px-4 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg font-medium text-sm hover:bg-red-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Cancel subscription"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                      </button>
                    )}
                  </div>
                </section>

                {/* Help Section */}
                <section
                  className="bg-white rounded-xl border border-gray-100 shadow-sm"
                  aria-labelledby="help-title"
                >
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3
                      id="help-title"
                      className="text-base font-semibold text-gray-900"
                    >
                      Need Help?
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about your subscription or need to make
                      changes?
                    </p>
                    <a
                      href="mailto:support@sortstorage.com"
                      className="text-[#1742B1] font-medium text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#1742B1]/20 focus:ring-offset-2 rounded"
                      aria-label="Contact support via email"
                    >
                      Contact Support →
                    </a>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
