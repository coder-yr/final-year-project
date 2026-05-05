"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Booking } from '@/lib/types';
import { TicketPDF } from './ticket-pdf';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => (
            <Button variant="outline" disabled className="gap-2">
                <Download className="h-4 w-4" /> Loading PDF...
            </Button>
        ),
    }
);

interface DownloadTicketButtonProps {
    booking: Booking;
}

export function DownloadTicketButton({ booking }: DownloadTicketButtonProps) {
    // Allow download for all bookings, TicketPDF handles missing fields gracefully
    // if (booking.type !== 'train' && !booking.pnr) {
    //    return null; 
    // }

    return (
        <PDFDownloadLink
            document={<TicketPDF booking={booking} />}
            fileName={`Ticket-${booking.pnr || booking.id}.pdf`}
        >
            {({ blob, url, loading, error }) => {
                if (error) {
                    console.error("PDF Generation Error:", error);
                    return (
                        <Button variant="outline" disabled className="gap-2 text-red-500">
                            Error Generating PDF
                        </Button>
                    );
                }
                return (
                    <Button variant="outline" disabled={loading} className="gap-2">
                        <Download className="h-4 w-4" />
                        {loading ? 'Generating...' : 'Download Ticket'}
                    </Button>
                );
            }}
        </PDFDownloadLink>
    );
}
