"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  updateHotelStatus,
  updateRoomStatus,
  fromFirestore,
} from "@/lib/data";
import type { Hotel, Room, Booking, User, Bus, Train, Flight } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { OverviewStats } from "./overview-stats";
import { CampaignChart } from "./campaign-chart";
import { GuestsWidget } from "./guests-widget";
import { RevenueGauge } from "./revenue-gauge";
import { GuestsView } from "./views/guests-view";
import { BookingsView } from "./views/bookings-view";
import { PropertyView } from "./views/property-view";
import { BusView } from "./views/bus-view";
import { TrainView } from "./views/train-view";
import { FlightView } from "./views/flight-view";
import { AnalyticsView } from "./views/analytics-view";
import { TransactionsView } from "./views/transactions-view";
import { CashflowView } from "./views/cashflow-view";
import { MessagesView } from "./views/messages-view";
import {
  Loader2,
  Building,
  TrainFront,
  Plane,
  Bus as BusIcon,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { DataTable } from "./data-table";
import { columns as allBusesColumns } from "./all-buses-columns";
import { AddBusForm } from "./add-bus-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [allTrains, setAllTrains] = useState<Train[]>([]);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    const hotelsQuery = query(collection(db, 'hotels'));
    const roomsQuery = query(collection(db, 'rooms'), where('status', '==', 'pending'));
    const bookingsQuery = query(collection(db, 'bookings'));
    const usersQuery = query(collection(db, 'users'));
    const busesQuery = query(collection(db, 'buses'));
    const trainsQuery = query(collection(db, 'trains'));
    const flightsQuery = query(collection(db, 'flights'));

    const unsubscribeHotels = onSnapshot(hotelsQuery, (snapshot) => {
      const hotelsData = snapshot.docs.map(doc => fromFirestore<Hotel>(doc)).filter(Boolean) as Hotel[];
      setAllHotels(hotelsData);
      setPendingHotels(hotelsData.filter(h => h.status === 'pending'));
      setLoading(false);
    });

    const unsubscribeRooms = onSnapshot(roomsQuery, async (snapshot) => {
      const roomsData = snapshot.docs.map(doc => fromFirestore<Room>(doc)).filter(Boolean) as Room[];
      const enrichedRooms = await Promise.all(roomsData.map(async (room) => {
        const hotelDocRef = doc(db, 'hotels', room.hotelId);
        const hotelDoc = await getDoc(hotelDocRef);
        const hotelData = hotelDoc.exists() ? fromFirestore<Hotel>(hotelDoc) : undefined;
        return { ...room, hotelName: hotelData ? hotelData.name : 'Unknown Hotel' };
      }));
      setPendingRooms(enrichedRooms);
    });

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => fromFirestore<Booking>(doc)).filter(Boolean) as Booking[];
      setBookings(bookingsData);
    });

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => fromFirestore<User>(doc)).filter(Boolean) as User[];
      setAllUsers(usersData);
    });

    const unsubscribeBuses = onSnapshot(busesQuery, (snapshot) => {
      const busesData = snapshot.docs.map(doc => fromFirestore<Bus>(doc)).filter(Boolean) as Bus[];
      setAllBuses(busesData);
    });

    const unsubscribeTrains = onSnapshot(trainsQuery, (snapshot) => {
      const trainsData = snapshot.docs.map(doc => fromFirestore<Train>(doc)).filter(Boolean) as Train[];
      setAllTrains(trainsData);
    });

    const unsubscribeFlights = onSnapshot(flightsQuery, (snapshot) => {
      const flightsData = snapshot.docs.map(doc => fromFirestore<Flight>(doc)).filter(Boolean) as Flight[];
      setAllFlights(flightsData);
    });


    return () => {
      unsubscribeHotels();
      unsubscribeRooms();
      unsubscribeBookings();
      unsubscribeUsers();
      unsubscribeBuses();
      unsubscribeTrains();
      unsubscribeFlights();
    };
  }, []);


  const handleHotelAction = (hotelId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateHotelStatus(hotelId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Hotel ${action}d`,
        description: `The hotel has been successfully ${action}d.`,
      });
    });
  };

  const handleRoomAction = (roomId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateRoomStatus(roomId, action === 'approve' ? 'approved' : 'rejected');
      toast({
        title: `Room ${action}d`,
        description: `The room has been successfully ${action}d.`,
      });
    });
  };

  // Calculate metrics
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const activeHotels = allHotels.filter(h => h.status === 'approved').length;

  if (loading && allHotels.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <Sidebar
        className="hidden md:flex"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h2>
                <p className="text-muted-foreground">Welcome back, {user?.name || 'Admin'}. Here is your platform's health check.</p>
              </div>

              {/* Service Health Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-sky-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Hotels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{activeHotels}</div>
                      <Building className="h-4 w-4 text-sky-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-violet-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Bus Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{allBuses.length}</div>
                      <BusIcon className="h-4 w-4 text-violet-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Train Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{allTrains.length}</div>
                      <TrainFront className="h-4 w-4 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Flight Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{allFlights.length}</div>
                      <Plane className="h-4 w-4 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Embedded Analytics */}
              <AnalyticsView bookings={bookings} />

            </div>
          )}

          {/* Guests / Users View */}
          {activeTab === 'guests' && (
            <GuestsView users={allUsers} />
          )}

          {/* Bus System View */}
          {activeTab === 'bus-system' && <BusView buses={allBuses} />}

          {/* Train System View */}
          {activeTab === 'train-system' && <TrainView trains={allTrains} />}

          {/* Flight System View */}
          {activeTab === 'flight-system' && <FlightView flights={allFlights} />}

          {/* Bookings View */}
          {activeTab === 'bookings' && (
            <BookingsView bookings={bookings} />
          )}

          {/* Hotel Management View */}
          {activeTab === 'hotels' && (
            <PropertyView
              pendingHotels={pendingHotels}
              pendingRooms={pendingRooms}
              allHotels={allHotels}
              onHotelAction={handleHotelAction}
              onRoomAction={handleRoomAction}
              isPending={isPending}
            />
          )}

          {/* Analytics View (Dedicated Tab) */}
          {activeTab === 'analytic' && (
            <AnalyticsView bookings={bookings} />
          )}

          {/* Transactions View */}
          {activeTab === 'transaction' && (
            <TransactionsView bookings={bookings} />
          )}

          {/* Messages View */}
          {activeTab === 'messages' && (
            <MessagesView />
          )}

        </main>
      </div>
    </div>
  );
}
