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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import Sidebar from "./sidebar";

export default function ServicesTab() {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [newService, setNewService] = useState({
    name: "",
    duration: "",
    price: "",
    category: "",
    description: "",
  });
  const [error, setError] = useState("");

  // Fetch services & categories on mount
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      const data = res.data;
      if (Array.isArray(data)) {
        if (typeof data[0] === "string") setCategories(data);
        else if (data[0]?.name) setCategories(data.map((c: any) => c.name));
        else setCategories([]);
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Add service
  const handleAddService = async () => {
    if (
      !newService.name ||
      !newService.duration ||
      !newService.price ||
      !newService.category
    )
      return;
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
    } catch (err) {
      console.error(err);
      setError("Failed to add service.");
    }
  };

  // Edit service
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

  // Update service
  const handleUpdateService = async () => {
    if (!editingService) return;
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
        services.map((s) => (s._id === editingService._id ? res.data : s))
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
    } catch (err) {
      console.error(err);
      setError("Failed to update service.");
    }
  };

  // Delete service
  const handleDeleteService = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`
      );
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete service.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={true}
        setSidebarOpen={() => {}}
      />
      <div className="flex-1 space-y-6 p-6">
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
                <Plus className="h-4 w-4 mr-2" /> Add Service
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
                        setNewService({
                          ...newService,
                          duration: e.target.value,
                        })
                      }
                      placeholder="60"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (£)</Label>
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
                      {loading && (
                        <SelectItem disabled value={""}>
                          Loading...
                        </SelectItem>
                      )}
                      {!loading && categories.length === 0 && (
                        <SelectItem disabled value={""}>
                          No categories
                        </SelectItem>
                      )}
                      {!loading &&
                        categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
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

        {error && <p className="text-red-600">{error}</p>}

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
                        £{service.price}
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
              {services.length === 0 && (
                <p className="text-muted-foreground">No services available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
