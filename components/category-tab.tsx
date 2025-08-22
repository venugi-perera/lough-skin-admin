"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "./sidebar";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

export default function CategoryPanel() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [payload, setPayload] = useState<{ name?: string; desc?: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories safely
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      console.log(data);

      // Ensure it's an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Save or update category
  const handleSaveCategory = async () => {
    if (!payload.name?.trim()) return alert("Category name cannot be empty");

    try {
      setLoading(true);
      let res;
      const body = { name: payload.name, description: payload.desc || "" };

      if (editingId) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error("Failed to save category");
      await fetchCategories();
      setPayload({});
      setEditingId(null);
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
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
            <h2 className="text-3xl font-bold tracking-tight">
              Manage Categories
            </h2>
            <p className="text-muted-foreground">
              Manage Categories - Create, edit, and delete service categories
            </p>
          </div>
        </div>

        <Card className="pt-6">
          <CardContent>
            {/* Input fields */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Category Name"
                value={payload.name || ""}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
              />
              <Input
                placeholder="Category Description"
                value={payload.desc || ""}
                onChange={(e) =>
                  setPayload({ ...payload, desc: e.target.value })
                }
              />
              <Button onClick={handleSaveCategory} disabled={loading}>
                {editingId ? "Update" : "Add"}
              </Button>
            </div>

            {/* Category list */}
            {loading ? (
              <p>Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500 italic">No data found</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPayload({
                            name: cat.name || "",
                            desc: cat.description || "",
                          });
                          setEditingId(cat._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCategory(cat._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
