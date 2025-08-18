"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar"; // <-- import sidebar
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Scissors } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DashboardTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBookings(true);
      setLoadingServices(true);
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
        ]);
        setBookings(bookingsRes.data.bookings);
        setServices(servicesRes.data);
        setError("");
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoadingBookings(false);
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const todaysBookings = bookings.filter((b) => b.date === today).length;

  const calculateTotalRevenue = (bookings: any) =>
    bookings.reduce((sum: number, booking: any) => {
      if (
        booking.payment_status === "paid" &&
        typeof booking.total === "number"
      ) {
        return sum + booking.total;
      }
      return sum;
    }, 0);

  const revenue = calculateTotalRevenue(bookings);

  const formatAppointment = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${formattedDate} — ${timeStr}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center flex-1 p-6">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar always open */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={true}
        setSidebarOpen={() => {}}
      />

      {/* Dashboard Content */}
      {loadingBookings || loadingServices ? (
        <div className="flex items-center justify-center flex-1 p-6">
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-6 p-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening at your salon.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaysBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Bookings scheduled for today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{revenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Revenue from completed bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
                <Scissors className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available services
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest appointments scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 4).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {booking.customerDetails.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.services.map((s: any) => s.name).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatAppointment(
                            booking.appointmentDate,
                            booking.appointmentTime
                          )}
                        </p>
                        <Badge
                          className={getStatusColor(booking.payment_status)}
                        >
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
