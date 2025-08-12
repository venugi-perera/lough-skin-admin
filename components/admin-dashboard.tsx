"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  DollarSign,
  LogOut,
  Menu,
  Scissors,
  Settings,
  Users,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Mock data
const mockServices = [
  { id: 1, name: "Haircut & Style", duration: 60, price: 45, category: "Hair" },
  { id: 2, name: "Hair Color", duration: 120, price: 85, category: "Hair" },
  { id: 3, name: "Manicure", duration: 45, price: 25, category: "Nails" },
  { id: 4, name: "Pedicure", duration: 60, price: 35, category: "Nails" },
  {
    id: 5,
    name: "Facial Treatment",
    duration: 90,
    price: 65,
    category: "Skincare",
  },
  {
    id: 6,
    name: "Eyebrow Threading",
    duration: 30,
    price: 20,
    category: "Beauty",
  },
];

const mockBookings = [
  {
    id: 1,
    customerName: "Sarah Johnson",
    service: "Haircut & Style",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    customerName: "Emily Davis",
    service: "Hair Color",
    date: "2024-01-15",
    time: "2:00 PM",
    status: "pending",
    phone: "(555) 987-6543",
  },
  {
    id: 3,
    customerName: "Jessica Wilson",
    service: "Manicure",
    date: "2024-01-16",
    time: "11:30 AM",
    status: "confirmed",
    phone: "(555) 456-7890",
  },
  {
    id: 4,
    customerName: "Amanda Brown",
    service: "Facial Treatment",
    date: "2024-01-16",
    time: "3:00 PM",
    status: "completed",
    phone: "(555) 321-0987",
  },
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [services, setServices] = useState(mockServices);
  // const [bookings, setBookings] = useState(mockBookings);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState("");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    price: "",
    category: "",
    description: "",
  });

  // Replace mock data with fetched data
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      setError("");
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services`
        );
        setServices(res.data);
      } catch (e) {
        setError("Failed to load services.");
      } finally {
        setLoadingServices(false);
      }
    };

    const fetchBookings = async () => {
      setLoadingBookings(true);
      setError("");
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
        );
        setBookings(res.data.bookings);
      } catch (e) {
        setError("Failed to load bookings.");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchServices();
    fetchBookings();
  }, []);

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

  // Update Booking Status
  const updateBookingStatus = async (id: number, status: string) => {
    setError("");
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`,
        {
          status,
        }
      );
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch {
      setError("Failed to update booking status.");
    }
  };

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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Calendar },
    { id: "services", label: "Services", icon: Scissors },
    { id: "bookings", label: "Bookings", icon: Clock },
    { id: "customers", label: "Customers", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderDashboard = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Count today's bookings
    const todaysBookings = bookings.filter((b) => b.date === today).length;

    // Sum revenue from completed bookings (assuming service price is known)
    // If booking doesn't have price, sum services matching name

    function calculateTotalRevenue(bookings: any) {
      return bookings.reduce((sum: any, booking: any) => {
        // Ensure booking has a total and is paid
        if (
          booking.payment_status === "paid" &&
          typeof booking.total === "number"
        ) {
          return sum + booking.total;
        }
        return sum;
      }, 0);
    }

    // Example usage:
    const revenue = calculateTotalRevenue(bookings);
    console.log("Total Revenue:", revenue);

    // let revenue = 0;
    // bookings.forEach((b) => {
    //   if (b.payment_status === "paid") {
    //     const service = services.find((s) => s.name === b.service);
    //     if (service) revenue += service.price;
    //   }
    // });

    return (
      <div className="space-y-6 p-6">
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
            {/* <CardContent>
              <div className="text-2xl font-bold">
                {loadingBookings ? "..." : todaysBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Bookings scheduled for today
              </p>
            </CardContent> */}
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingBookings ? "..." : todaysBookings}
              </div>
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
              <div className="text-2xl font-bold">
                $
                {loadingBookings || loadingServices
                  ? "..."
                  : revenue.toFixed(2)}
              </div>
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
              <div className="text-2xl font-bold">
                {loadingServices ? "..." : services.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Available services
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                Total customers (static)
              </p>
            </CardContent>
          </Card> */}
        </div>

        {/* Recent bookings */}
        <div className="grid gap-4 ">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest appointments scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingBookings ? (
                  <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <p>No bookings found.</p>
                ) : (
                  bookings.slice(0, 4).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center space-x-4"
                    >
                      {/* <Avatar>
                        <AvatarFallback>
                          {booking.customerDetails.name}
                        </AvatarFallback>
                      </Avatar> */}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {booking.customerDetails.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.services
                            .map((service: any) => service.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {booking.appointmentDate}
                          {booking.appointmentTime}
                        </p>
                        <Badge
                          className={getStatusColor(booking.payment_status)}
                        >
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>Most booked services this month</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingServices ? (
                <p>Loading services...</p>
              ) : services.length === 0 ? (
                <p>No services found.</p>
              ) : (
                <div className="space-y-4">
                  {services.slice(0, 4).map((service) => (
                    <div
                      key={service._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${service.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.duration} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    );
  };

  const renderServices = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your salon services and pricing
          </p>
        </div>
        <Dialog
          open={isServiceDialogOpen}
          onOpenChange={setIsServiceDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingService(null);
                setNewService({
                  name: "",
                  duration: "",
                  price: "",
                  category: "",
                  description: "",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update the service details below."
                  : "Fill in the details for the new service."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  placeholder="e.g., Haircut & Style"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({ ...newService, duration: e.target.value })
                    }
                    placeholder="60"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: e.target.value })
                    }
                    placeholder="45.00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newService.category}
                  onValueChange={(value) =>
                    setNewService({ ...newService, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hair">Hair</SelectItem>
                    <SelectItem value="Nails">Nails</SelectItem>
                    <SelectItem value="Skincare">Skincare</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Massage">Massage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the service..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsServiceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingService ? handleUpdateService : handleAddService
                }
              >
                {editingService ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            Manage your salon's service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.category}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">
                      Duration: {service.duration} min
                    </span>
                    <span className="text-sm font-medium">
                      ${service.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">Manage customer appointments</p>
        </div>
        {/* <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-8 w-64" />
          </div>
        </div> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            View and manage customer appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
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
                    {booking.services
                      .map((service: any) => service.name)
                      .join(", ")}
                  </TableCell>

                  <TableCell>{booking.appointmentDate}</TableCell>
                  <TableCell>{booking.appointmentTime}</TableCell>
                  <TableCell>{booking.customerDetails.phone}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
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
                        onClick={() =>
                          updateBookingStatus(booking._id, "cancelled")
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">Manage your customer database</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
            <p className="text-muted-foreground">
              Customer management features coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your salon preferences
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
            <p className="text-muted-foreground">
              Settings configuration coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "services":
        return renderServices();
      case "bookings":
        return renderBookings();
      case "customers":
        return renderCustomers();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            {/* <Scissors className="h-8 w-8 text-pink-600" /> */}
            <span className="text-xl font-bold">Lough Skin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                  activeTab === item.id
                    ? "bg-pink-50 text-pink-600 border-r-2 border-pink-600"
                    : "text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
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
        {/* <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main> */}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
