import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';

const generalSans = localFont({
  src: [
    {
      path: '../../public/fonts/GeneralSans-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Medium.otf',
      weight: '700', // Mapping bold to Medium as per available files
      style: 'normal',
    }
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'Lodgify Lite | Hotel, Flight & Bus Bookings',
  description: 'A modern hotel reservation system offering seamless booking experiences for hotels, flights, and buses.',
  openGraph: {
    title: 'Lodgify Lite',
    description: 'Book your perfect stay, flight, or bus ride with ease.',
    url: 'https://lodgify-lite.vercel.app',
    siteName: 'Lodgify Lite',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lodgify Lite',
    description: 'A modern hotel reservation system.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${generalSans.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans antialiased">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
