"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "./sidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "recharts";
import { toast } from "sonner";

import { format } from "date-fns";

interface Holiday {
  _id: string;
  name: string;
  date: string;
  description?: string;
}

export default function HolidayPanel() {
  const [activeTab, setActiveTab] = useState("holidays");
  const [selectedUser, setSelectedUser] = useState("");
  const [payload, setPayload] = useState<{
    name?: string;
    date?: string;
    desc?: string;
  }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [leaves, setLeaves] = useState<
    { _id?: string; user: string; date: string }[]
  >([]);

  //   const { toast } = useToast();
  // ✅ Fetch holidays on load
  useEffect(() => {
    // fetchHolidays();
  }, []);

  const handleSaveHoliday = async () => {
    if (!selectedDate) {
      toast.error("Missing information", {
        description: "Please select user and date before applying leave.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leaves/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: selectedUser,
            date: selectedDate,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Leave Applied ✅", {
          description: `${selectedUser} applied leave on ${selectedDate}`,
        });
        setLeaves((prev) => [
          ...prev,
          { _id: data.leave?._id, user: selectedUser, date: selectedDate },
        ]);
        setSelectedUser("");
        setSelectedDate("");
      } else {
        toast.error("Failed to apply leave", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", {
        description: "Failed to connect to the server.",
      });
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
            <h2 className="text-3xl font-bold tracking-tight">Manage Leaves</h2>
            <p className="text-muted-foreground">Manage company holidays</p>
          </div>
        </div>

        <Card className="pt-6">
          <CardContent>
            {/* Input fields */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Label>Select User</Label>
              <Select onValueChange={setSelectedUser} value={selectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {/* {users.map((user) => ( */}
                  <SelectItem key={1} value={"Bithey"}>
                    Bithey
                  </SelectItem>
                  <SelectItem key={2} value={"Shriya"}>
                    Shriya
                  </SelectItem>
                  {/* ))} */}
                </SelectContent>
              </Select>
              <Input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-1/3"
              />
              <Input
                placeholder="Description (optional)"
                value={payload.desc || ""}
                onChange={(e) =>
                  setPayload({ ...payload, desc: e.target.value })
                }
                className="w-full sm:w-1/3"
              />
              <Button onClick={handleSaveHoliday} disabled={loading}>
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
