"use client";

import { useState } from "react";
import { Room } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { updateRoom } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PricingViewProps {
    rooms: Room[];
}

export function PricingView({ rooms }: PricingViewProps) {
    const { toast } = useToast();
    const [updatingIds, setUpdatingIds] = useState<string[]>([]);
    const [prices, setPrices] = useState<{ [id: string]: number }>({});

    const handlePriceChange = (id: string, value: string) => {
        setPrices(prev => ({ ...prev, [id]: parseInt(value) || 0 }));
    };

    const handleUpdatePrice = async (room: Room) => {
        const newPrice = prices[room.id];
        if (!newPrice || newPrice === room.price) return;

        setUpdatingIds(prev => [...prev, room.id]);
        try {
            await updateRoom(room.id, { price: newPrice });
            toast({
                title: "Price updated",
                description: `Price for ${room.title} updated to ${formatINR(newPrice)}`,
            });
            // Ideally revalidate data here
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update price",
                variant: "destructive",
            });
        } finally {
            setUpdatingIds(prev => prev.filter(id => id !== room.id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pricing</h2>
                <p className="text-muted-foreground">Manage your room rates.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Room Rates</CardTitle>
                    <CardDescription>Update nightly rates for your rooms.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Current Price</TableHead>
                                <TableHead>New Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.title}</TableCell>
                                    <TableCell>{formatINR(room.price)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-sm">₹</span>
                                            <Input
                                                type="number"
                                                className="w-32 h-9"
                                                placeholder={room.price.toString()}
                                                value={prices[room.id] !== undefined ? prices[room.id] : ''}
                                                onChange={(e) => handlePriceChange(room.id, e.target.value)}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => handleUpdatePrice(room)}
                                            disabled={updatingIds.includes(room.id) || !prices[room.id] || prices[room.id] === room.price}
                                        >
                                            {updatingIds.includes(room.id) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                "Update"
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
