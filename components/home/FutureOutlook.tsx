import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FutureOutlook() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Future Outlook
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every item available to ship, receive, and send with faster delivery
            times, anywhere.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Market Position
            </h3>
            <p className="text-gray-600 mb-6">
              Sort is positioned to disrupt the $40 billion self-storage
              industry—a market growing at 4.15% annually and projected to reach
              $85 billion by 2030—by delivering unmatched value through
              tech-driven innovation.
            </p>
            <p className="text-gray-600">
              With your funding, we will accelerate our expansion into
              high-demand urban markets while deploying cutting-edge systems to
              solidify our competitive edge.
            </p>
          </div>
          <Button size="lg" className="bg-black text-white hover:bg-gray-800">
            Join Our Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
