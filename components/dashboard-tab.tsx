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

const DashboardTab = ({
  bookings,
  loadingBookings,
  loadingServices,
  services,
}: any) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Count today's bookings
  const todaysBookings = bookings.filter((b: any) => b.date === today).length;

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

  function formatAppointment(dateStr: any, timeStr: any) {
    // Parse the date string into a Date object
    const date = new Date(dateStr);

    // Format date to a readable form, e.g., August 12, 2025
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Return combined formatted string
    return `${formattedDate} — ${timeStr}`;
  }

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
              ${loadingBookings || loadingServices ? "..." : revenue.toFixed(2)}
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
            <p className="text-xs text-muted-foreground">Available services</p>
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
                bookings.slice(0, 4).map((booking: any) => (
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
                        {formatAppointment(
                          booking.appointmentDate,
                          booking.appointmentTime
                        )}
                      </p>
                      <Badge className={getStatusColor(booking.payment_status)}>
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

export default DashboardTab;
