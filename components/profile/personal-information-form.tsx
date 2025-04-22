import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const PersonalInformationForm = () => {
  return (
    <Card className="mt-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mx-6 mt-6">
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue="Shamal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue="Jayasinghe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="sandro.jaya@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="address">
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input id="address1" name="address1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" name="address2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal/Zip Code</Label>
                  <Input id="zip" name="zip" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PersonalInformationForm;
