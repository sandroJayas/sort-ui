"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Map,
  Check,
  AlertCircle,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============= Schema =============
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "Too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Too long"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .trim()
    .min(6, "Invalid phone number")
    .regex(/^\+?[0-9\s\-()]{6,}$/, "Invalid phone number format"),
  address_line_1: z.string().min(1, "Address is required").max(100, "Too long"),
  address_line_2: z.string().trim().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  postal_code: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(10, "Too long")
    .regex(/^[A-Za-z0-9\s\-]{3,10}$/, "Invalid postal code format"),
  country: z.string().transform(() => "United States"),
  payment_method_id: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ============= Constants =============
const TABS = {
  PERSONAL: "personal",
  ADDRESS: "address",
} as const;

type TabKey = (typeof TABS)[keyof typeof TABS];

interface TabConfig {
  id: TabKey;
  label: string;
  icon: React.ReactNode;
  description: string;
  fields: string[];
}

const TAB_CONFIG: TabConfig[] = [
  {
    id: TABS.PERSONAL,
    label: "Personal Details",
    icon: <User className="w-4 h-4" />,
    description: "Your basic information",
    fields: ["first_name", "last_name", "email", "phone_number"],
  },
  {
    id: TABS.ADDRESS,
    label: "Address",
    icon: <MapPin className="w-4 h-4" />,
    description: "Your location details",
    fields: [
      "address_line_1",
      "address_line_2",
      "city",
      "postal_code",
      "country",
    ],
  },
];

// ============= Components =============
interface StepIndicatorProps {
  tabs: TabConfig[];
  activeTab: TabKey;
  completedFields: Set<string>;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  tabs,
  activeTab,
  completedFields,
}) => {
  const getTabCompletion = (tab: TabConfig) => {
    const requiredFields = tab.fields.filter((f) => f !== "address_line_2");
    const completed = requiredFields.filter((f) =>
      completedFields.has(f),
    ).length;
    return {
      completed,
      total: requiredFields.length,
      percentage: Math.round((completed / requiredFields.length) * 100),
    };
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const completion = getTabCompletion(tab);
        const isComplete = completion.percentage === 100;

        return (
          <React.Fragment key={tab.id}>
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-blue-50 border border-blue-600 text-blue-600 shadow-lg scale-110"
                      : isComplete
                        ? "bg-green-50 border border-green-600 text-green-600"
                        : "bg-[#F5F7FA] text-[#333333] border-2 border-gray-200",
                  )}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : tab.icon}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium mt-2 transition-colors",
                    isActive ? "text-[#1742B1]" : "text-[#333333]",
                  )}
                >
                  {tab.label}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {completion.completed}/{completion.total} fields
                </span>
              </div>
            </div>

            {index < tabs.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-gray-200 relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${completion.percentage === 100 ? 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============= Main Component =============
const PersonalDataForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TABS.PERSONAL);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { data: user, isLoading, error } = useUser();
  const { data: session } = useSession();
  const { mutate, isPending } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const {
    watch,
    formState: { isDirty },
  } = form;
  const watchedValues = watch();

  // Track completed fields
  const completedFields = useMemo(() => {
    const fields = new Set<string>();
    Object.entries(watchedValues).forEach(([key, value]) => {
      if (value && value !== "") {
        fields.add(key);
      }
    });
    return fields;
  }, [watchedValues]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const allRequiredFields = TAB_CONFIG.flatMap((tab) =>
      tab.fields.filter((f) => f !== "address_line_2"),
    );
    const completed = allRequiredFields.filter((f) =>
      completedFields.has(f),
    ).length;
    return Math.round((completed / allRequiredFields.length) * 100);
  }, [completedFields]);

  const onSubmit = useCallback(
    (values: ProfileFormValues) => {
      mutate(values, {
        onSuccess: () => {
          toast.success("Profile updated successfully!", {
            description: "Your changes have been saved.",
            icon: <Check className="w-4 h-4" />,
          });
          setHasUnsavedChanges(false);
        },
        onError: (error) => {
          toast.error("Failed to update profile", {
            description: error.message || "Please try again later.",
            icon: <AlertCircle className="w-4 h-4" />,
          });
        },
      });
    },
    [mutate],
  );

  // Handle tab navigation
  const handleTabChange = useCallback(
    (tab: TabKey) => {
      if (hasUnsavedChanges) {
        if (confirm("You have unsaved changes. Do you want to continue?")) {
          setActiveTab(tab);
        }
      } else {
        setActiveTab(tab);
      }
    },
    [hasUnsavedChanges],
  );

  // Initialize form with user data
  useEffect(() => {
    if (user || session) {
      form.reset({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? session?.user?.email ?? "",
        phone_number: user?.phone_number ?? "",
        address_line_1: user?.address_line_1 ?? "",
        address_line_2: user?.address_line_2 ?? "",
        city: user?.city ?? "",
        postal_code: user?.postal_code ?? "",
        country: "United States",
        payment_method_id: user?.payment_method_id ?? "",
      });
    }
  }, [user, session, form]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error?.name || "Error", {
        description: error?.message || "Failed to load user data",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <Card className="rounded-xl bg-white">
        <CardContent className="p-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      {/* Header with Progress */}
      <div className="px-6 py-4 bg-[#F5F7FA] border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">
              Profile Information
            </h2>
            <p className="text-sm text-[#333333] mt-0.5">
              Complete your profile to enable all features
            </p>
          </div>
          <div className="flex items-center gap-3">
            {overallProgress === 100 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF9900] rounded-full">
                <span className="text-sm font-medium text-white">
                  Complete!
                </span>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm font-medium text-[#111111]">
                  {overallProgress}% Complete
                </p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#1742B1] rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 text-[#FF9900] text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white">
        {/* Step Indicator */}
        <StepIndicator
          tabs={TAB_CONFIG}
          activeTab={activeTab}
          completedFields={completedFields}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200",
                activeTab === tab.id
                  ? "bg-[#1742B1] text-white shadow-lg"
                  : "bg-[#F5F7FA] text-[#333333] hover:bg-gray-200",
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details Tab */}
            {activeTab === TABS.PERSONAL && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-[#333333]">
                          <User className="w-4 h-4 text-[#1742B1]" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-[#333333]">
                          <User className="w-4 h-4 text-[#1742B1]" />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[#333333]">
                        <Mail className="w-4 h-4 text-[#1742B1]" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="h-11 pr-10 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                            {...field}
                          />
                          {field.value && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Check className="w-4 h-4 text-green-500" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[#333333]">
                        <Phone className="w-4 h-4 text-[#1742B1]" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Next Button */}
                <div className="flex justify-between pt-4">
                  <div className="text-sm text-[#333333]">
                    Fill in all fields to continue
                  </div>
                  <Button
                    type="button"
                    onClick={() => setActiveTab(TABS.ADDRESS)}
                    disabled={
                      !completedFields.has("first_name") ||
                      !completedFields.has("last_name") ||
                      !completedFields.has("phone_number")
                    }
                    className="bg-[#1742B1] hover:bg-[#1742B1]/90 text-white shadow-md"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === TABS.ADDRESS && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <FormField
                  control={form.control}
                  name="address_line_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[#333333]">
                        <MapPin className="w-4 h-4 text-[#1742B1]" />
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street"
                          className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_line_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[#333333]">
                        <Building className="w-4 h-4 text-[#1742B1]" />
                        Apartment, Suite, etc.
                        <span className="text-xs text-gray-400">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apt 4B"
                          className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-[#333333]">
                          <Building className="w-4 h-4 text-[#1742B1]" />
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#333333]">
                      <Map className="w-4 h-4 text-[#1742B1]" />
                      State/Province
                    </Label>
                    <Input
                      value="New York"
                      readOnly
                      className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-[#333333]">
                          <Mail className="w-4 h-4 text-[#1742B1]" />
                          ZIP/Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10001"
                            className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111] placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-[#333333]">
                          <Map className="w-4 h-4 text-[#1742B1]" />
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value="United States"
                            readOnly
                            className="h-11 bg-[#F5F7FA] border-gray-200 text-[#111111]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(TABS.PERSONAL)}
                    className="border-gray-200 text-[#333333] hover:bg-[#F5F7FA]"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending || !isDirty}
                    className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white shadow-md min-w-[140px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {overallProgress === 100 && user?.email && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#111111]">
                    Profile Complete!
                  </p>
                  <p className="text-xs text-[#333333] mt-0.5">
                    You have access to all features.
                  </p>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default PersonalDataForm;
