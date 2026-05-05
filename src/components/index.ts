/**
 * Barrel exports for feature-based components
 * 
 * This file provides clean imports for all components organized by feature.
 * 
 * Usage:
 * import { HotelCard, LoginForm, SearchBar } from '@/components'
 */

// Layout Components
export { Header } from './header';
export { Footer } from './footer';
export { ThemeToggle } from './theme-toggle';

// Auth Components (to be moved to features/auth)
export { LoginForm } from './features/auth/login-form';
export { SignupForm } from './features/auth/signup-form';

// Hotel Components (to be moved to features/hotels)
export { HotelCard } from './features/hotel/hotel-card';
export { SimilarProperties } from './features/hotel/similar-properties';
export { ImageGrid } from './features/hotel/image-grid';

// Room Components (to be moved to features/rooms)
export { RoomCard } from './features/room/room-card';

// Booking Components (to be moved to features/bookings)
export { BookingCard } from './features/hotel/booking-card';
export { UserBookings } from './features/booking/user-bookings';
export { PaymentGateway } from './features/booking/payment-gateway';

// Review Components (to be moved to features/reviews)
export { ReviewCard } from './features/reviews/review-card';
export { ReviewSummary } from './features/reviews/review-summary';
export { ReviewsSection } from './features/reviews/reviews-section';

// Search Components (to be moved to features/search)
export { SearchBar } from './features/search/SearchBar';
export { FilterSidebar } from './features/search/FilterSidebar';
export { SearchForm } from './features/search/search-form';
export { SearchFormWithRedux as SearchFormRedux } from './features/search/search-form-redux';
export { SearchFilters } from './features/search/search-filters';
export { default as SearchSuggestions } from './features/search/search-suggestions';

// Bus Components (to be moved to features/buses)
export { BusCard } from './features/bus/BusCard';

// Marketing Components (to be moved to features/marketing)
export { HeroSceneWrapper } from './features/marketing/hero-scene-wrapper';
export { ExplorePackages, DiscoverMore } from './features/marketing/marketing-sections';
export { PlanYourTrip } from './features/marketing/plan-your-trip';
export { VerticalsShowcase } from './features/marketing/verticals-showcase';
export { MeetTheHost } from './features/marketing/meet-the-host';

// Admin Components (to be moved to features/admin)
export { AdminDashboard } from './features/admin/admin-dashboard';

// Owner Components (to be moved to features/owner)
export { OwnerDashboard } from './features/owner/owner-dashboard';

// AI Components (to be moved to features/search)
export { AiSuggestionButton } from './features/search/ai-suggestion-button';
export { SuggestionModal } from './features/search/suggestion-modal';

// Shared Components
export { ThemeProvider } from './theme-provider';

// UI Components (Shadcn)
export { Skeleton, CardSkeleton } from './ui/skeletons';
export { Button } from './ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Toaster } from './ui/toaster';
export { useToast } from '@/hooks/use-toast';

/**
 * Note: After migration to feature folders, update these exports to:
 * export * from './features/auth'
 * export * from './features/hotels'
 * etc.
 */
