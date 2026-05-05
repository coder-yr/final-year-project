"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createTrain } from "@/lib/data";
import { Loader2, Train, Plus, Trash2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const seatSchema = z.object({
    id: z.string().min(1, "Class ID is required"),
    classType: z.string().min(1, "Class Type is required"),
    price: z.string().transform((val) => parseInt(val, 10)),
    available: z.string().transform((val) => parseInt(val, 10)),
    status: z.string().default("available"),
});

const trainSchema = z.object({
    trainNumber: z.string().min(1, "Train number is required"),
    trainName: z.string().min(1, "Train name is required"),
    depart: z.string().min(1, "Departure station is required"),
    arrive: z.string().min(1, "Arrival station is required"),
    departTime: z.string().min(1, "Departure time is required"),
    arriveTime: z.string().min(1, "Arrival time is required"),
    duration: z.string().min(1, "Duration is required"),
    runningDays: z.array(z.string()).min(1, "Select at least one running day"),
    amenities: z.array(z.string()).default([]),
    seats: z.array(seatSchema).min(1, "Add at least one seat class"),
});

type TrainFormValues = z.infer<typeof trainSchema>;

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const AMENITIES_LIST = ["Pantry", "Bio Toilets", "Charging Points", "Catering", "Bedding"];

const CLASS_TYPES = [
    { id: "1A", label: "First AC (1A)" },
    { id: "2A", label: "Second AC (2A)" },
    { id: "3A", label: "Third AC (3A)" },
    { id: "SL", label: "Sleeper (SL)" },
    { id: "CC", label: "Chair Car (CC)" },
    { id: "EC", label: "Exec. Chair Car (EC)" },
    { id: "2S", label: "Second Seating (2S)" },
];

export function AddTrainForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TrainFormValues>({
        resolver: zodResolver(trainSchema),
        defaultValues: {
            trainNumber: "",
            trainName: "",
            depart: "",
            arrive: "",
            departTime: "",
            arriveTime: "",
            duration: "",
            runningDays: [],
            amenities: [],
            seats: [{ id: "SL", classType: "SL", price: 0, available: 0, status: "available" }],
        },
    });

    const { fields: seatFields, append: appendSeat, remove: removeSeat } = useFieldArray({
        control,
        name: "seats",
    });

    const runningDays = watch("runningDays");
    const amenities = watch("amenities");

    const handleDayChange = (day: string) => {
        if (runningDays.includes(day)) {
            setValue("runningDays", runningDays.filter(d => d !== day));
        } else {
            setValue("runningDays", [...runningDays, day]);
        }
    };

    const handleAmenityChange = (amenity: string) => {
        if (amenities.includes(amenity)) {
            setValue("amenities", amenities.filter(a => a !== amenity));
        } else {
            setValue("amenities", [...amenities, amenity]);
        }
    };

    const onSubmit = async (data: TrainFormValues) => {
        setIsSubmitting(true);
        try {
            await createTrain(data);
            toast({
                title: "Success",
                description: "Train added successfully",
            });
            reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add train",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="trainNumber">Train Number</Label>
                    <Input id="trainNumber" {...register("trainNumber")} placeholder="12345" />
                    {errors.trainNumber && <p className="text-red-500 text-sm">{errors.trainNumber.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="trainName">Train Name</Label>
                    <Input id="trainName" {...register("trainName")} placeholder="Express Name" />
                    {errors.trainName && <p className="text-red-500 text-sm">{errors.trainName.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="depart">From (Station)</Label>
                    <Input id="depart" {...register("depart")} placeholder="Origin Station" />
                    {errors.depart && <p className="text-red-500 text-sm">{errors.depart.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="arrive">To (Station)</Label>
                    <Input id="arrive" {...register("arrive")} placeholder="Destination Station" />
                    {errors.arrive && <p className="text-red-500 text-sm">{errors.arrive.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="departTime">Depart Time</Label>
                        <Input id="departTime" type="time" {...register("departTime")} />
                        {errors.departTime && <p className="text-red-500 text-sm">{errors.departTime.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="arriveTime">Arrive Time</Label>
                        <Input id="arriveTime" type="time" {...register("arriveTime")} />
                        {errors.arriveTime && <p className="text-red-500 text-sm">{errors.arriveTime.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (e.g. 12h 30m)</Label>
                    <Input id="duration" {...register("duration")} placeholder="12h 30m" />
                    {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                </div>
            </div>

            {/* Running Days */}
            <div className="space-y-3">
                <Label>Running Days</Label>
                <div className="flex flex-wrap gap-4">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                                id={`day-${day}`}
                                checked={runningDays.includes(day)}
                                onCheckedChange={() => handleDayChange(day)}
                            />
                            <Label htmlFor={`day-${day}`}>{day}</Label>
                        </div>
                    ))}
                </div>
                {errors.runningDays && <p className="text-red-500 text-sm">{errors.runningDays.message}</p>}
            </div>

            {/* Amenities */}
            <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-4">
                    {AMENITIES_LIST.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                                id={`amenity-${item}`}
                                checked={amenities.includes(item)}
                                onCheckedChange={() => handleAmenityChange(item)}
                            />
                            <Label htmlFor={`amenity-${item}`}>{item}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seat Classes */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Seat Classes</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSeat({ id: "SL", classType: "SL", price: 0, available: 0, status: "available" })}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Class
                    </Button>
                </div>

                {seatFields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 border rounded-lg bg-slate-50">
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select
                                onValueChange={(val) => {
                                    setValue(`seats.${index}.classType`, val);
                                    setValue(`seats.${index}.id`, val);
                                }}
                                defaultValue={item.classType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CLASS_TYPES.map(type => (
                                        <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Price (â‚¹)</Label>
                            <Input type="number" {...register(`seats.${index}.price` as const)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Available</Label>
                            <Input type="number" {...register(`seats.${index}.available` as const)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                onValueChange={(val) => setValue(`seats.${index}.status`, val)}
                                defaultValue={item.status}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="waitlist">Waitlist</SelectItem>
                                    <SelectItem value="full">Full</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSeat(index)} className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Train
            </Button>
        </form>
    );
}
