"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Train, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PNRStatusForm() {
    const [pnr, setPnr] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pnr || pnr.length !== 10) {
            setError('Please enter a valid 10-digit PNR number');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        // Simulate API check
        // Real API check
        try {
            const response = await fetch(`/api/bookings/train?pnr=${pnr}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'PNR not found');
            } else {
                setResult(data);
            }
        } catch (err) {
            setError('Failed to check status. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full shadow-none border-0 bg-transparent">
            <CardHeader className="px-0 pt-0">
                {/* Header removed or simplified since parent container has header */}
                <CardDescription className="text-white/70">
                    Enter your 10-digit PNR number to check live status
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <form onSubmit={handleCheck} className="space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="ENTER PNR NUMBER"
                            value={pnr}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPnr(val);
                                setError('');
                            }}
                            className="pl-4 h-12 text-lg font-mono tracking-widest uppercase border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-orange-400/20 transition-all rounded-xl"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 font-medium">
                            {pnr.length}/10
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20"
                        disabled={loading || pnr.length !== 10}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Get Status
                            </>
                        )}
                    </Button>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm flex items-center gap-2 backdrop-blur-sm"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md bg-black/40"
                            >
                                <div className="bg-green-600/90 text-white p-3 flex items-center justify-between backdrop-blur-sm">
                                    <span className="font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        {result.status}
                                    </span>
                                    <span className="text-sm opacity-90">PNR: {result.pnr}</span>
                                </div>
                                <div className="p-4 space-y-4 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-lg">{result.trainName}</p>
                                            <p className="text-sm text-white/60">#{result.trainNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{result.date}</p>
                                            <p className="text-sm text-white/60">Journey Date</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-white/10 pt-3">
                                        <p className="text-xs font-bold text-white/50 uppercase mb-2">Passengers</p>
                                        <div className="space-y-2">
                                            {result.passengers.map((p: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span>{p.name}</span>
                                                    <span className="font-mono bg-white/10 px-2 py-1 rounded border border-white/10 text-xs">
                                                        {p.seat} <span className="text-green-400 font-bold ml-1">{p.status}</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </CardContent>
        </Card>
    );
}
