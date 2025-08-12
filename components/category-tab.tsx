"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CategoryPanel() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories when component loads
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
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE or UPDATE category
  const handleSaveCategory = async () => {
    if (!name.trim()) return alert("Category name cannot be empty");

    try {
      setLoading(true);
      let res;
      if (editingId) {
        // UPDATE existing
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }
        );
      } else {
        // CREATE new
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      }
      if (!res.ok) throw new Error("Failed to save category");
      await fetchCategories(); // Refresh after save
      setName("");
      setEditingId(null);
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE category
  const handleDeleteCategory = async (id: any) => {
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
    <div className="space-y-6 p-6">
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

      <CardContent>
        {/* Input for new/edit category */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleSaveCategory} disabled={loading}>
            {editingId ? "Update" : "Add"}
          </Button>
        </div>

        {/* Category List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat: any) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{cat.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setName(cat.name);
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
    </div>
    // <Card className="max-w-xl mx-auto">
    //   <CardHeader>
    //     <CardTitle>Manage Categories</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     {/* Input for new/edit category */}
    //     <div className="flex gap-2 mb-4">
    //       <Input
    //         placeholder="Category Name"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       />
    //       <Button onClick={handleSaveCategory} disabled={loading}>
    //         {editingId ? "Update" : "Add"}
    //       </Button>
    //     </div>

    //     {/* Category List */}
    //     {loading ? (
    //       <p>Loading...</p>
    //     ) : (
    //       <ul className="space-y-2">
    //         {categories.map((cat: any) => (
    //           <li
    //             key={cat.id}
    //             className="flex justify-between items-center border p-2 rounded"
    //           >
    //             <span>{cat.name}</span>
    //             <div className="flex gap-2">
    //               <Button
    //                 variant="outline"
    //                 onClick={() => {
    //                   setName(cat.name);
    //                   setEditingId(cat.id);
    //                 }}
    //               >
    //                 Edit
    //               </Button>
    //               <Button
    //                 variant="destructive"
    //                 onClick={() => handleDeleteCategory(cat.id)}
    //               >
    //                 Delete
    //               </Button>
    //             </div>
    //           </li>
    //         ))}
    //       </ul>
    //     )}
    //   </CardContent>
    // </Card>
  );
}
