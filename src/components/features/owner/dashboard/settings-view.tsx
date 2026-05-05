"use client";

import { Hotel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SettingsViewProps {
    hotel: Hotel;
}

export function SettingsView({ hotel }: SettingsViewProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
                <p className="text-muted-foreground">Manage details and configurations.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage visibility and status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Accepting Bookings</Label>
                            <p className="text-sm text-muted-foreground">
                                Turn this off to temporarily pause new bookings.
                            </p>
                        </div>
                        <Switch checked={true} />
                    </div>
                    {/* Add more settings as needed */}
                </CardContent>
            </Card>

            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Danger Zone</AlertTitle>
                <AlertDescription>
                    Deleting your hotel cannot be undone. Please proceed with caution.
                </AlertDescription>
                <div className="mt-4">
                    <Button variant="destructive" disabled>Delete Hotel (Contact Admin)</Button>
                </div>
            </Alert>
        </div>
    );
}
