"use client";

import { useState } from "react";
import { Room } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateRoom } from "@/lib/data";
import { Loader2 } from "lucide-react";

interface EditRoomDialogProps {
    room: Room | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditRoomDialog({ room, open, onOpenChange, onSuccess }: EditRoomDialogProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Simple state management for form
    const [formData, setFormData] = useState({
        title: room?.title || "",
        description: room?.description || "",
        price: room?.price || 0,
        capacity: room?.capacity || 2,
        virtualTourUrl: room?.virtualTourUrl || "",
    });

    // Update state when room changes
    if (room && formData.title === "" && !isSaving) {
        setFormData({
            title: room.title,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            virtualTourUrl: room.virtualTourUrl || "",
        });
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!room) return;
        setIsSaving(true);
        try {
            await updateRoom(room.id, {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                virtualTourUrl: formData.virtualTourUrl,
            });
            toast({
                title: "Success",
                description: "Room updated successfully.",
            });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update room.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Room</DialogTitle>
                    <DialogDescription>
                        Make changes to {room?.title}. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (INR)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">
                            Capacity
                        </Label>
                        <Input
                            id="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => handleChange('capacity', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="virtualTour" className="text-right">
                            Virtual Tour
                        </Label>
                        <Input
                            id="virtualTour"
                            placeholder="https://kuula.co..."
                            value={formData.virtualTourUrl}
                            onChange={(e) => handleChange('virtualTourUrl', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
