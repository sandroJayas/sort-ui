"use client";

import React, { useState, useEffect } from "react";
import { DashboardNavbar } from "@/components/shared/Navbar";
import Sidebar from "@/components/profile/Sidebar";
import PersonalDataForm from "@/components/profile/PersonalDataForm";
import Container from "@/components/shared/Container";
import {
  ChevronRight,
  Home,
  User,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============= Components =============
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        {item.href ? (
          <a
            href={item.href}
            className="flex items-center gap-1.5 text-[#333333] hover:text-[#1742B1] transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-[#111111] font-medium">
            {item.icon}
            {item.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
}) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#1742B1]/5 via-white to-[#F5F7FA] rounded-2xl p-8 mb-8 border border-gray-200">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1742B1] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1742B1] rounded-full blur-3xl" />
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-4 right-4">
      <div className="flex items-center gap-2">
        {badge && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF9900] rounded-full text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="relative">
      <h1 className="text-3xl font-bold text-[#111111] mb-2 flex items-center gap-3">
        <div className="w-12 h-12 bg-[#1742B1] rounded-xl flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        {title}
      </h1>
      <p className="text-[#333333] max-w-2xl">{description}</p>
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  </div>
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => (
  <>
    {/* Backdrop */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
    )}

    {/* Menu Panel */}
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 md:hidden shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#F5F7FA]">
        <h2 className="font-semibold text-[#111111]">Menu</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-[#333333]" />
        </button>
      </div>
      <div className="p-4 bg-[#F5F7FA] h-full">
        <Sidebar tab="personal-information" />
      </div>
    </div>
  </>
);

// ============= Main Component =============
export default function PersonalInformationPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-3.5 h-3.5" />,
    },
    { label: "Profile", href: "/profile" },
    { label: "Personal Information", icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <DashboardNavbar />

      {/* Mobile Menu Toggle - Using Orange Accent */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF9900] text-white rounded-full shadow-lg flex items-center justify-center md:hidden z-30 hover:scale-110 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <Container className="py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Back Button for Mobile */}
          <a
            href="/dashboard"
            className="md:hidden flex items-center gap-2 text-sm text-[#333333] hover:text-[#1742B1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </a>
        </div>

        {/* Page Header */}
        <PageHeader
          title="Personal Information"
          description="Manage your personal details, contact information, and shipping address. Keep your profile up to date to ensure smooth order processing."
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Hidden on Mobile */}
          <aside className="hidden md:block lg:w-80 flex-shrink-0">
            <div
              className={cn(
                "sticky transition-all duration-300",
                scrolled ? "top-24" : "top-8",
              )}
            >
              <Sidebar tab="personal-information" />
            </div>
          </aside>

          {/* Main Form */}
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Form Card */}
              <PersonalDataForm />

              {/* Help Section */}
              <div className="bg-gradient-to-r from-[#1742B1]/5 to-[#1742B1]/10 rounded-xl p-6 border border-[#1742B1]/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#1742B1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#111111] mb-1">
                      Your data is secure
                    </h3>
                    <p className="text-sm text-[#333333] mb-3">
                      We use industry-standard encryption to protect your
                      personal information. Your data is never shared without
                      your consent.
                    </p>
                    <a
                      href="/privacy"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#1742B1] hover:text-[#1742B1]/80 transition-colors"
                    >
                      Learn about our privacy policy
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-[#111111] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF9900]" />
                  Profile Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1742B1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#1742B1]">
                        1
                      </span>
                    </div>
                    <div className="text-sm text-[#333333]">
                      <strong className="text-[#111111]">
                        Complete your profile
                      </strong>{" "}
                      to unlock all features and ensure smooth order processing.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1742B1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#1742B1]">
                        2
                      </span>
                    </div>
                    <div className="text-sm text-[#333333]">
                      <strong className="text-[#111111]">
                        Keep your address updated
                      </strong>{" "}
                      to avoid delivery issues with your stored items.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF9900]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#FF9900]">
                        3
                      </span>
                    </div>
                    <div className="text-sm text-[#333333]">
                      <strong className="text-[#111111]">
                        Enable two-factor authentication
                      </strong>{" "}
                      in security settings for enhanced account protection.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
