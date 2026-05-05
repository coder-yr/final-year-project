export type Seat = {
  id: string;
  price: number;
  status: string;
  deck: string;
  row: number;
  col: number;
};

export type BusPoint = {
  id: string;
  name: string;
  time: string; // HH:mm
  address: string;
};

export type Bus = {
  id: string;
  operator: string;
  depart: string;
  arrive: string;
  duration: string;
  price: string;
  seats: Seat[];
  amenities?: string[];
  boardingPoints?: BusPoint[];
  droppingPoints?: BusPoint[];
};
export type Flight = {
  id: string;
  airline: string;
  depart: string;
  arrive: string;
  duration: string;
  price: string;
  stops: string;
};

export type TrainSeat = {
  id: string;
  classType: string; // '1A', '2A', '3A', 'SL', etc.
  price: number;
  available: number;
  status: 'available' | 'limited' | 'waitlist' | 'full';
};

export type Train = {
  id: string;
  trainNumber: string;
  trainName: string;
  depart: string;
  arrive: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  runningDays: string[]; // ['Mon', 'Tue', 'Wed', etc.]
  seats: TrainSeat[];
  amenities?: string[];
};



import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string; // Custom avatar URL
  // In a real app, you would not store passwords in plaintext.
  // This is for demonstration purposes only.
  password?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: Date | Timestamp;
};

export type NewUser = Omit<User, 'id' | 'createdAt'>;

export type HotelDocument = {
  name: string;
  url: string;
}

export type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  facilities: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  isPetFriendly: boolean;
  documents: HotelDocument[];
  ownerId: string;
  status: 'pending' | 'approved' | 'rejected';
  coverImage: string;
  images?: string[];
  category?: 'Premium' | 'Eco-Friendly' | 'Ski Resort' | 'Historic' | 'Boutique' | 'Resort' | 'Cabin';
  createdAt: Date;
  ownerName?: string; // For admin view
  ownerEmail?: string; // For admin view
  'data-ai-hint'?: string;
  videoUrl?: string;
  // Quality Control Fields
  averageRating?: number;
  totalReviews?: number;
  probationStatus?: 'none' | 'warning' | 'probation' | 'suspended';
  warningSentAt?: Date | Timestamp;
  virtualTourUrl?: string; // Optional Kuula tour URL
  isVirtualTourEnabled?: boolean;
};

export type NewHotel = Omit<Hotel, 'id' | 'status' | 'createdAt' | 'coverImage'> & {
  coverImage?: string;
};

export type HotelSearchCriteria = {
  destination?: string;
  dateRange?: { from: Date; to: Date };
  guests?: number;
  facilities?: string[];
  minPrice?: number;
  maxPrice?: number;
}

export type Room = {
  id: string;
  title: string;
  hotelId: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | Timestamp;
  hotelName?: string; // For admin view
  'data-ai-hint'?: string;
  virtualTourUrl?: string; // Optional room-specific Kuula tour
};

export type NewRoom = Omit<Room, 'id' | 'createdAt' | 'hotelName' | 'data-ai-hint' | 'status'> & {
  images: string[];
};

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  fromDate: Date | Timestamp;
  toDate: Date | Timestamp;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date | Timestamp;
  // Denormalized data for easy display
  hotelName?: string;
  hotelLocation?: string;
  roomTitle?: string;
  coverImage?: string;
  userName?: string; // For owner view
  personName?: string; // Passenger details
  age?: string; // Passenger details
  gender?: string; // Passenger details
  hotelOwnerId?: string; // For owner view filtering

  // Unified Booking Fields
  type?: 'hotel' | 'flight' | 'bus' | 'train';
  title?: string; // Generic title (e.g. Train Name, Bus Operator)
  subtitle?: string; // Generic subtitle (e.g. Route)

  // Train Specific
  trainName?: string;
  trainNumber?: string;
  pnr?: string;
  classType?: string;
  passengers?: number;
  boardingStation?: string;
  destinationStation?: string;

  // Flight Specific
  airline?: string;
  flightNumber?: string;
  departTime?: string;
  arriveTime?: string;

  // Bus Specific
  busId?: string;
  busName?: string;
  operator?: string;
  seats?: any[]; // Could be detailed specific seat type
  passengerInfo?: any;

  cancelledAt?: Date | Timestamp;
};

export type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status'>

export type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCountry: string; // Added for UI consistency
  hotelId: string;
  rating: number;
  comment: string;
  createdAt: Date | Timestamp;
}

export type NewReview = Omit<Review, 'id' | 'createdAt'>;

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date | Timestamp;
  readBy: string[];
  isAdmin: boolean;
};

export type Conversation = {
  id: string;
  participants: string[];
  participantsData: {
    userId: string;
    name: string;
    avatar?: string;
    email?: string;
  }[];
  lastMessage: string;
  lastMessageAt: Date | Timestamp;
  adminUnreadCount: number;
  userUnreadCount: number;
  startedAt: Date | Timestamp;
  status: 'active' | 'archived';
};
