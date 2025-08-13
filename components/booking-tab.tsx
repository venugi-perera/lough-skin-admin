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

const BookingsTab = ({ bookings, updateBookingStatus }: any) => {
  function formatAppointment(dateStr: any) {
    // Parse the date string into a Date object
    const date = new Date(dateStr);

    // Format date to a readable form, e.g., August 12, 2025
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Return combined formatted string
    return `${formattedDate}`;
  }
  return (
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
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-medium">
                    {booking.customerDetails.name}
                  </TableCell>
                  <TableCell>
                    {booking.services
                      .map((service: any) => service.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>£{booking.total.toFixed(2)}</TableCell>
                  {/* Display price */}
                  <TableCell>
                    {formatAppointment(booking.appointmentDate)}
                  </TableCell>
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
};

export default BookingsTab;
