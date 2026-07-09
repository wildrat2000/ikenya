
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
const PortfolioPage = React.lazy(() => import("./pages/PortfolioPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const ServiceDetailPage = React.lazy(() => import("./pages/ServiceDetailPage"));
const AdminLoginPage = React.lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = React.lazy(() => import("./pages/AdminDashboardPage"));
const AdminAppointmentsPage = React.lazy(() => import("./pages/AdminAppointmentsPage"));
const AdminContactsPage = React.lazy(() => import("./pages/AdminContactsPage"));
const AdminSubscribersPage = React.lazy(() => import("./pages/AdminSubscribersPage"));
const AdminTechContentPage = React.lazy(() => import("./pages/AdminTechContentPage"));
const AdminServicesPage = React.lazy(() => import("./pages/AdminServicesPage"));
const AdminPortfolioPage = React.lazy(() => import("./pages/AdminPortfolioPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/contacts" element={<AdminContactsPage />} />
            <Route path="/admin/subscribers" element={<AdminSubscribersPage />} />
            <Route path="/admin/tech-content" element={<AdminTechContentPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
