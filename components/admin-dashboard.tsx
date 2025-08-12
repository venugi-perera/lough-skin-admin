"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import DashboardTab from "./dashboard-tab";
import ServicesTab from "./service-tab";
import BookingsTab from "./booking-tab";
import { is } from "date-fns/locale";
import CategoryConfigPanel from "./category-tab";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    price: "",
    category: "",
    description: "",
  });

  // Add Service
  const handleAddService = async () => {
    if (
      newService.name &&
      newService.duration &&
      newService.price &&
      newService.category
    ) {
      setError("");
      try {
        const payload = {
          name: newService.name,
          duration: parseInt(newService.duration),
          price: parseFloat(newService.price),
          category: newService.category,
          description: newService.description || "",
        };
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
          payload
        );
        setServices([...services, res.data]);
        setNewService({
          name: "",
          duration: "",
          price: "",
          category: "",
          description: "",
        });
        setIsServiceDialogOpen(false);
      } catch {
        setError("Failed to add service.");
      }
    }
  };

  // Edit Service (open dialog)
  const handleEditService = (service: any) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      description: service.description || "",
    });
    setIsServiceDialogOpen(true);
  };

  // Update Service
  const handleUpdateService = async () => {
    if (!editingService) return;
    setError("");
    try {
      const payload = {
        name: newService.name,
        duration: parseInt(newService.duration),
        price: parseFloat(newService.price),
        category: newService.category,
        description: newService.description || "",
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${editingService._id}`,
        payload
      );
      setServices(
        services.map((s) => (s.id === editingService.id ? res.data : s))
      );
      setEditingService(null);
      setNewService({
        name: "",
        duration: "",
        price: "",
        category: "",
        description: "",
      });
      setIsServiceDialogOpen(false);
    } catch {
      setError("Failed to update service.");
    }
  };

  // Delete Service
  const handleDeleteService = async (id: number) => {
    setError("");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`
      );
      setServices(services.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete service.");
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingServices(true);
      setLoadingBookings(true);
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`),
        ]);
        setServices(servicesRes.data);
        setBookings(bookingsRes.data.bookings);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoadingServices(false);
        setLoadingBookings(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            bookings={bookings}
            services={services}
            loadingBookings={loadingBookings}
            loadingServices={loadingServices}
          />
        );
      case "services":
        return (
          <ServicesTab
            isServiceDialogOpen={isServiceDialogOpen}
            setIsServiceDialogOpen={setIsServiceDialogOpen}
            editingService={editingService}
            newService={newService}
            handleEditService={handleEditService}
            handleUpdateService={handleUpdateService}
            handleAddService={handleAddService}
            handleDeleteService={handleDeleteService}
            setEditingService={setEditingService}
            setNewService={setNewService}
            services={services}
          />
        );
      case "bookings":
        return <BookingsTab bookings={bookings} setBookings={setBookings} />;
      case "category":
        return <CategoryConfigPanel />;
      // case "customers":
      //   return <CustomersTab />;
      // case "settings":
      //   return <SettingsTab />;
      default:
        return (
          <DashboardTab
            bookings={bookings}
            services={services}
            loadingBookings={loadingBookings}
            loadingServices={loadingServices}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome back, Admin
            </span>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        {loadingBookings || loadingServices ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">{renderContent()}</div>
        )}
      </div>
    </div>
  );
}
