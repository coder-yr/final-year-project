"use client"

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, Clock, Calendar, ArrowRight, Wifi, Coffee, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Train as TrainType } from '@/lib/types';
import { TrainCard } from '@/components/features/train/train-card';

export default function RailwaySearchPage() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';

    const [trains, setTrains] = useState<TrainType[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
    const [dataSource, setDataSource] = useState<'api' | 'firestore'>('firestore');

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch(`/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
                if (response.ok) {
                    const result = await response.json();
                    // Handle both old and new response formats
                    const trainData = result.data || result;
                    setTrains(Array.isArray(trainData) ? trainData : []);
                    setDataSource(result.source || 'firestore');
                }
            } catch (error) {
                console.error('Error fetching trains:', error);
            } finally {
                setLoading(false);
            }
        };

        if (from && to) {
            fetchTrains();
        } else {
            setLoading(false);
        }
    }, [from, to, date]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getClassBadgeColor = (className: string) => {
        const colors: Record<string, string> = {
            '1A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            '2A': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            '3A': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'SL': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            '2S': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[className] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    };

    const getStatusColor = (status: string) => {
        if (status === 'available') return 'text-green-600 dark:text-green-400';
        if (status === 'limited') return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-red-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20" />
            </div>

            <Header />
            <main className="flex-1 pt-24 pb-12 relative z-10">
                <div className="container px-4">
                    {/* Search Summary */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-3xl font-bold">
                                {from} <ArrowRight className="inline w-6 h-6 mx-2" /> {to}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{date ? formatDate(date) : 'Select Date'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Train className="w-4 h-4" />
                                <span>{trains.length} trains found</span>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            <p className="mt-4 text-muted-foreground">Searching for trains...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && trains.length === 0 && (
                        <Card className="p-12 text-center">
                            <Train className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h2 className="text-2xl font-bold mb-2">No trains found</h2>
                            <p className="text-muted-foreground mb-6">
                                Try searching for a different route or date
                            </p>
                            <Button onClick={() => window.history.back()}>
                                Go Back to Search
                            </Button>
                        </Card>
                    )}

                    {/* Train Results */}
                    <div className="space-y-4">
                        {trains.map((train) => (
                            <TrainCard key={train.id} train={train} date={date} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
