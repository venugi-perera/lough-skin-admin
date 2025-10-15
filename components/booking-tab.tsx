"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      return "bg-green-100 text-green-800";
  }
};

export default function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualBooking, setManualBooking]: any = useState({
    name: "",
    email: "",
    note: "",
    address: "",
    phone: "",
    services: [] as string[], // service IDs
    date: "",
    time: "",
    total: "",
  });

  const [activeTab, setActiveTab] = useState("bookings");
  const [services, setServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const totalAmount =
    manualBooking && manualBooking.services && manualBooking.services.length > 0
      ? manualBooking.services
          .map((id: string) => services.find((s) => s._id === id)?.price || 0)
          .reduce((sum: any, price: any) => sum + price, 0)
      : 0;

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/availability?date=${selectedDate}`
        );
        setAvailableSlots(res.data); // ["10:30 AM", "11:30 AM", ...]
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services`
      );
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
        );
        setBookings(res.data.bookings);
        setError("");
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    fetchServices();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
        status,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch {
      setError("Failed to update booking status.");
    }
  };

  const formatAppointment = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Inside your component
  const handleManualBookingSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      // Prepare services array
      const selectedServices = manualBooking.services.map((id: string) => {
        const s = services.find((s) => s._id === id);
        return {
          name: s?.name,
          price: s?.price,
          serviceId: s?._id,
          duration: s?.duration,
        };
      });

      // Send POST request
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/manual`,
        // `http://localhost:8000/api/bookings/manual`,
        {
          customerDetails: {
            name: manualBooking.name,
            email: manualBooking.email,
            phone: manualBooking.phone,
          },
          services: selectedServices,
          appointmentDate: manualBooking.date,
          appointmentTime: manualBooking.time,
          total: totalAmount,
          note: manualBooking.note,
          address: manualBooking.address,
          status: "pending",
        }
      );

      // Reset form and hide
      setShowManualForm(false);
      setManualBooking({
        name: "",
        email: "",
        phone: "",
        services: "",
        date: "",
        time: "",
        total: "",
        note: "",
        address: "",
      });

      // Refresh bookings list
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
      );
      setBookings(res.data.bookings);
    } catch (err) {
      setError("Failed to add booking manually.");
    }
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
      <div className="flex-1 space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
            <p className="text-muted-foreground">
              Manage customer appointments
            </p>
          </div>

          <Dialog open={showManualForm} onOpenChange={setShowManualForm}>
            <DialogTrigger asChild>
              <Button>+ Add Booking</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Booking Manually</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="w-full border p-2 rounded"
                  value={manualBooking.name}
                  onChange={(e) =>
                    setManualBooking({ ...manualBooking, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Customer Email"
                  className="w-full border p-2 rounded"
                  value={manualBooking.email}
                  onChange={(e) =>
                    setManualBooking({
                      ...manualBooking,
                      email: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full border p-2 rounded"
                  value={manualBooking.phone}
                  onChange={(e) =>
                    setManualBooking({
                      ...manualBooking,
                      phone: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="note"
                  placeholder="Note"
                  className="w-full border p-2 rounded"
                  value={manualBooking.note}
                  onChange={(e) =>
                    setManualBooking({
                      ...manualBooking,
                      note: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="address"
                  placeholder="Address"
                  className="w-full border p-2 rounded"
                  value={manualBooking.address}
                  onChange={(e) =>
                    setManualBooking({
                      ...manualBooking,
                      address: e.target.value,
                    })
                  }
                  required
                />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Services
                  </label>
                  <div className="border rounded p-2 max-h-40 overflow-y-auto">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center space-x-2 mb-1"
                      >
                        <input
                          type="checkbox"
                          id={`service-${service._id}`}
                          checked={manualBooking.services.includes(service._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setManualBooking({
                                ...manualBooking,
                                services: [
                                  ...manualBooking.services,
                                  service._id,
                                ],
                              });
                            } else {
                              setManualBooking({
                                ...manualBooking,
                                services: manualBooking.services.filter(
                                  (id: any) => id !== service._id
                                ),
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`service-${service._id}`}
                          className="text-sm"
                        >
                          {service.name} (£{service.price})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={manualBooking.date}
                  onChange={(e) => {
                    const date = e.target.value;
                    setManualBooking({ ...manualBooking, date });
                    setSelectedDate(date);
                  }}
                  required
                />

                <select
                  className="w-full border p-2 rounded"
                  value={manualBooking.time}
                  onChange={(e) =>
                    setManualBooking({ ...manualBooking, time: e.target.value })
                  }
                  required
                >
                  <option value="">Select a time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>

                <div className="font-bold text-lg">
                  Total: £{totalAmount.toFixed(2)}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowManualForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Booking</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              View and manage customer appointments
            </CardDescription>
          </CardHeader>
          {loading ? (
            <div className="flex-1 space-y-2">
              <p>Loading...</p>
            </div>
          ) : (
            <CardContent>
              <div className="max-h-[600px] overflow-y-auto rounded-md ">
                <Table>
                  <TableHeader className="sticky top-0 ">
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Deposite</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          {booking.customerDetails.name}
                        </TableCell>
                        <TableCell>
                          {booking.services.map((s: any) => s.name).join(", ")}
                        </TableCell>
                        <TableCell>£{booking.depositPaid.toFixed(2)}</TableCell>
                        <TableCell>£{booking.total.toFixed(2)}</TableCell>
                        <TableCell>
                          {formatAppointment(booking.appointmentDate)}
                        </TableCell>
                        <TableCell>{booking.appointmentTime}</TableCell>
                        <TableCell>{booking.customerDetails.phone}</TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(booking.payment_status)}
                          >
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {booking.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "confirmed")
                                }
                              >
                                Confirm
                              </Button>
                            )}
                            {booking.status === "confirmed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateBookingStatus(booking._id, "completed")
                                }
                              >
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const subject = encodeURIComponent(
                                  "Booking Confirmation - Your Appointment"
                                );
                                const body = encodeURIComponent(
                                  `Hello ${booking.customerDetails.name},\n\n` +
                                    `Your appointment for ${booking.services
                                      .map((s: any) => s.name)
                                      .join(", ")} ` +
                                    `on ${formatAppointment(
                                      booking.appointmentDate
                                    )} at ${
                                      booking.appointmentTime
                                    } has been confirmed.\n\n` +
                                    `Total: £${booking.total.toFixed(2)}\n\n` +
                                    `Thank you for choosing us!\n\nBest regards,\nLough Skin`
                                );

                                window.location.href = `mailto:${booking.customerDetails.email}?subject=${subject}&body=${body}`;
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
