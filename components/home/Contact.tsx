import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              We&#39;d love to hear from you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">alan@sortinvite.com</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">(929) 294-6095</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">Morningside Heights, New York, NY</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
