import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Booking } from '@/lib/types';
import { format } from 'date-fns';

// Standard fonts (Helvetica) are built-in, no need to register external fonts that might 404
// Font.register({ ... });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EA580C', // Orange-600 to match theme
        fontFamily: 'Helvetica'
    },
    headerRight: {
        textAlign: 'right'
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        backgroundColor: '#f3f4f6',
        padding: 5,
        color: '#111827'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5
    },
    col: {
        flex: 1
    },
    label: {
        fontSize: 8,
        color: '#6b7280',
        marginBottom: 2
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 5
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        padding: 5
    },
    tableCell: {
        flex: 1,
        fontSize: 9
    },
    qrSection: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        width: 100,
        alignSelf: 'center'
    },
    qrPlaceholder: {
        fontSize: 8,
        textAlign: 'center',
        color: '#999'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 10
    }
});

interface TicketPDFProps {
    booking: Booking;
}

export const TicketPDF = ({ booking }: TicketPDFProps) => {
    // Helper to format currency
    const formatINR = (amount: number) => {
        if (typeof amount !== 'number') return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Helper to format date safely
    const formatDate = (date: any, fmt: string) => {
        try {
            if (!date) return 'N/A';
            const d = date && typeof date.toDate === 'function' ? date.toDate() : new Date(date);
            if (isNaN(d.getTime())) return 'N/A';
            return format(d, fmt);
        } catch (e) {
            return 'N/A';
        }
    };

    const isTrain = booking.type === 'train' || !!booking.trainNumber;
    const isBus = booking.type === 'bus' || !!booking.busName;
    const isHotel = booking.type === 'hotel' || !!booking.hotelName;

    const title = booking.title || booking.trainName || booking.hotelName || booking.busName || 'Booking Details';
    const subTitle = booking.subtitle || booking.hotelLocation || (isTrain ? `${booking.boardingStation} - ${booking.destinationStation}` : '');
    const refNumber = booking.pnr || booking.id?.slice(0, 8).toUpperCase() || 'N/A';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 1. Header & Authority Details */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logo}>Logify</Text>
                        <Text style={{ fontSize: 9, color: '#666', marginTop: 4 }}>Travel Booking System</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>E-TICKET</Text>
                        <Text style={{ fontSize: 9, marginTop: 4 }}>Date: {format(new Date(), 'dd MMM yyyy')}</Text>
                        <Text style={{ fontSize: 9 }}>Ref: {refNumber}</Text>
                    </View>
                </View>

                {/* 2. Journey/Stay Details */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sectionTitle}>{isHotel ? 'Stay Details' : 'Journey Details'}</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Hotel Name' : isBus ? 'Bus Operator' : 'Train Name & No.'}</Text>
                                <Text style={styles.value}>{title}</Text>
                                {isTrain && <Text style={{ fontSize: 8 }}>({booking.trainNumber || 'N/A'})</Text>}
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Room Type' : 'Class/Seat'}</Text>
                                <Text style={styles.value}>{booking.classType || booking.roomTitle || 'Standard'}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Check-in' : 'Date of Journey'}</Text>
                                <Text style={styles.value}>{formatDate(booking.fromDate, 'dd MMM yyyy')}</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Address' : 'Route'}</Text>
                                <Text style={styles.value}>{subTitle}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Check-in Time' : 'Departs'}</Text>
                                <Text style={styles.value}>{formatDate(booking.fromDate, 'HH:mm')} hrs</Text>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>{isHotel ? 'Check-out Time' : 'Arrives'}</Text>
                                <Text style={styles.value}>{formatDate(booking.toDate, 'HH:mm')} hrs</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3. Booking Information & QR */}
                    <View style={{ width: 140, marginLeft: 20 }}>
                        <Text style={styles.sectionTitle}>Booking Info</Text>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>{isTrain ? 'PNR Number' : 'Booking ID'}</Text>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{refNumber}</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: booking.status === 'confirmed' ? 'green' : 'orange' }}>
                                {(booking.status || 'Confirmed').toUpperCase()}
                            </Text>
                        </View>
                        {/* 5. QR Code */}
                        <View style={styles.qrSection}>
                            <Text style={styles.qrPlaceholder}>[QR CODE]</Text>
                            <Text style={{ fontSize: 6, textAlign: 'center', marginTop: 2 }}>Scan to Verify</Text>
                        </View>
                    </View>
                </View>

                {/* 1. Passenger/Guest Details */}
                <Text style={styles.sectionTitle}>{isHotel ? 'Guest Details' : 'Passenger Details'}</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={{ flex: 2, fontSize: 9, fontWeight: 'bold' }}>Name</Text>
                        <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold' }}>{isHotel ? 'Occupancy' : 'Age/Gender'}</Text>
                        <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold' }}>{isHotel ? 'Room ID' : 'Seat'}</Text>
                        <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold' }}>Status</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={{ flex: 2, fontSize: 9 }}>{booking.userName || booking.personName || 'Guest'}</Text>
                        <Text style={{ flex: 1, fontSize: 9 }}>
                            {booking.age ? `${booking.age} / ${booking.gender?.charAt(0) || 'M'}` : (isHotel ? 'Standard' : 'Adult')}
                        </Text>
                        <Text style={{ flex: 1, fontSize: 9 }}>
                            {booking.roomId || (booking.status === 'confirmed' ? 'Assigned' : 'WL')}
                        </Text>
                        <Text style={{ flex: 1, fontSize: 9 }}>
                            {(booking.status === 'confirmed' ? 'CNF' : 'WL').toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* 4. Fare & Payment Details */}
                <Text style={styles.sectionTitle}>Fare Details</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.row}>
                            <Text style={{ ...styles.label, width: 100 }}>Base Fare:</Text>
                            <Text style={{ fontSize: 9 }}>{formatINR((booking.totalPrice || 0) * 0.82)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={{ ...styles.label, width: 100 }}>Taxes & Charges:</Text>
                            <Text style={{ fontSize: 9 }}>{formatINR((booking.totalPrice || 0) * 0.18)}</Text>
                        </View>
                        <View style={{ ...styles.row, marginTop: 5, borderTop: 1, borderTopColor: '#eee', paddingTop: 5 }}>
                            <Text style={{ ...styles.label, width: 100, fontWeight: 'bold', color: '#000' }}>Total Paid:</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatINR(booking.totalPrice || 0)}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Payment Mode</Text>
                        <Text style={styles.value}>Online / Card</Text>
                        <Text style={styles.label}>Transaction ID</Text>
                        <Text style={styles.value}>TXN{(booking.id || '').slice(0, 8).toUpperCase()}</Text>
                    </View>
                </View>

                {/* 6. Cancellation & Refund Policy */}
                <Text style={styles.sectionTitle}>Cancellation Rules</Text>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>• Cancellation allowed up to 4 hours before departure/check-in.</Text>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>• Refund processed within 5-7 working days.</Text>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>• Standard cancellation charges apply.</Text>
                </View>

                {/* 7. Important Instructions */}
                <Text style={styles.sectionTitle}>Important Instructions</Text>
                <View>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>1. Please carry a valid original photo ID proof.</Text>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>2. Report to the station/hotel at least 30 minutes before time.</Text>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>3. Valid only for the details mentioned above.</Text>
                </View>

                {/* 8. Issuing Authority Details (Footer) */}
                <View style={styles.footer}>
                    <Text>Issued by Logify Travel Booking System • Helpdesk: support@logify.com • +91 1800-123-4567</Text>
                    <Text>www.logify.com</Text>
                </View>

            </Page>
        </Document>
    );
};
