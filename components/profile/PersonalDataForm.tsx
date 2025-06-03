"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "Too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Too long"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .trim()
    .min(6, "Invalid phone number")
    .regex(/^\+?[0-9\s\-()]{6,}$/, "Invalid phone number format"),
  address_line_1: z
    .string()
    .min(1, "Address Line 1 is required")
    .max(100, "Too long"),
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

const PersonalDataForm = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: user, isLoading, error } = useUser();
  const { data: session } = useSession();
  const { mutate, isPending } = useUpdateProfile();
  type ProfileFormValues = z.infer<typeof profileSchema>;
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const switchTab = () => {
    const formData = form.getValues();
    if (
      formData.first_name === "" ||
      formData.last_name === "" ||
      formData.phone_number === ""
    ) {
      setActiveTab("personal");
    } else if (
      formData.address_line_1 === "" ||
      formData.city === "" ||
      formData.postal_code === ""
    ) {
      setActiveTab("address");
    }
  };

  const onSubmit = (values: ProfileFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to update profile", {
          description: error.message,
        });
      },
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.name, {
        description: error?.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (user || session) {
      form.reset({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: session?.user.email ?? "",
        phone_number: user?.phone_number ?? "",
        address_line_1: user?.address_line_1 ?? "",
        address_line_2: user?.address_line_2 ?? "",
        city: user?.city ?? "",
        postal_code: user?.postal_code ?? "",
        country: "United States",
        payment_method_id: user?.payment_method_id ?? "",
      });
    }
  }, [user, form, session]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mx-6 mt-6">
        <TabsTrigger value="personal">Personal Details</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              onSubmitCapture={switchTab}
            >
              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <FormField
                control={form.control}
                name="email"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} size={"lg"}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </TabsContent>

      <TabsContent value="address">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              onSubmitCapture={switchTab}
            >
              <FormField
                control={form.control}
                name="address_line_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Address Line 1" {...field} />
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
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Address Line 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    value={"New York"}
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
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
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          {...field}
                          value={"United States"}
                          readOnly={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} size={"lg"}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </TabsContent>
    </Tabs>
  );
};

export default PersonalDataForm;
