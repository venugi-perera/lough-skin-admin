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

const ServicesTab = ({
  isServiceDialogOpen,
  setIsServiceDialogOpen,
  setEditingService,
  setNewService,
  editingService,
  newService,
  handleEditService,
  services,
  handleUpdateService,
  handleAddService,
  handleDeleteService,
}: any) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // GET categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      // Assuming data is an array of category strings or objects with a name property
      if (Array.isArray(data)) {
        // If objects, map to strings, adjust if needed
        if (typeof data[0] === "string") {
          setCategories(data);
        } else if (data[0]?.name) {
          setCategories(data.map((c: any) => c.name));
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            Manage your salon's service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service: any) => (
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesTab;
