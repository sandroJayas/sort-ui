"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React, { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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

const passwordSchema = z.object({
  email: z.string().email("Invalid email address"),
  current_password: z
    .string()
    .min(1, "Current password is required")
    .max(50, "Too long"),
  new_password: z
    .string()
    .min(1, "New password is required")
    .max(50, "Too long"),
  repeat_password: z
    .string()
    .min(1, "For security reason this field is required")
    .max(50, "Too long"),
});

const PersonalDataForm = () => {
  const { data: user, isLoading, error } = useUser();
  type PasswordFormValues = z.infer<typeof passwordSchema>;
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  //TODO change this
  const isPending = false;
  // @ts-expect-error temporary
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function mutate(values, params) {
    toast.error("This has to be implemented in the backend");
  }

  const onSubmit = (values: PasswordFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Password updated successfully!");
      },
      // @ts-expect-error temporary
      onError: (error) => {
        toast.error("Failed to change password", {
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
    if (user) {
      form.reset({
        email: user.email ?? "",
        current_password: "",
        new_password: "",
        repeat_password: "",
      });
    }
  }, [user, form]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Current Password"
                      {...field}
                      type={"password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeat_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Repeat Password"
                    {...field}
                  />
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
  );
};

export default PersonalDataForm;
