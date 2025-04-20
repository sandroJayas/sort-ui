import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Shield, DollarSign } from "lucide-react";

const features = [
  {
    title: "Cost Savings",
    description: "40-50% cost savings for long-term storage needs",
    icon: DollarSign,
  },
  {
    title: "Seamless Delivery",
    description: "Simple accessibility via AI integrations and delivery partnerships",
    icon: Truck,
  },
  {
    title: "Secure Storage",
    description: "State-of-the-art facilities with advanced security systems",
    icon: Shield,
  },
  {
    title: "On-Demand Access",
    description: "Your items available for shipping, receiving, and sending anytime",
    icon: Package,
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sort?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer customers a seamless, tech-enabled solution for managing their stored belongings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 