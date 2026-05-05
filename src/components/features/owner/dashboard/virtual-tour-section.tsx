
"use client";

import React, { useState } from 'react';
import { Hotel } from '@/lib/types';
import { updateHotel } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info, AlertCircle, CheckCircle2, Rotate3D, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VirtualTourSectionProps {
    hotel: Hotel;
}

export function VirtualTourSection({ hotel }: VirtualTourSectionProps) {
    const [isEnabled, setIsEnabled] = useState(hotel.isVirtualTourEnabled ?? false);
    const [url, setUrl] = useState(hotel.virtualTourUrl ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const validateUrl = (value: string) => {
        if (!value) return true; // Empty is valid if disabling
        // Basic check for Kuula URL
        return value.includes('kuula.co');
    };

    const handleSave = async () => {
        setError(null);
        setSuccessMessage(null);

        if (isEnabled && !url) {
            setError("Please enter a Virtual Tour URL or disable the feature.");
            return;
        }

        if (url && !validateUrl(url)) {
            setError("Please enter a valid Kuula.co tour URL.");
            return;
        }

        setIsSaving(true);
        try {
            await updateHotel(hotel.id, {
                virtualTourUrl: url,
                isVirtualTourEnabled: isEnabled
            });
            setSuccessMessage("Virtual tour settings saved successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        setIsSaving(true);
        setUrl("");
        setIsEnabled(false);
        try {
            await updateHotel(hotel.id, {
                virtualTourUrl: "",
                isVirtualTourEnabled: false
            });
            setSuccessMessage("Virtual tour removed.");
        } catch (err) {
            setError("Failed to remove tour.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Virtual Tour</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Enhance your hotel listing by adding a 360° virtual tour (powered by Kuula).
                </p>
            </div>

            <Card className="border-0 shadow-lg ring-1 ring-slate-900/5 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500" />
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Rotate3D className="h-5 w-5 text-teal-600" />
                                360° Virtual Experience
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ml-2">
                                    Optional
                                </span>
                            </CardTitle>
                            <CardDescription>
                                Allow guests to explore your property before they book.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-medium transition-colors", isEnabled ? "text-teal-600" : "text-slate-400")}>
                                {isEnabled ? "Active" : "Disabled"}
                            </span>
                            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* URL Input */}
                    <div className={cn("space-y-4 transition-all duration-300", !isEnabled && "opacity-50 grayscale pointer-events-none")}>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="tour-url">Kuula Tour URL</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="h-4 w-4 text-slate-400 hover:text-slate-500 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 text-slate-50 border-0">
                                            <p>Supports Kuula public tour links (Free & Pro plans).</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <Input
                                    id="tour-url"
                                    placeholder="https://kuula.co/share/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="pl-10 font-mono text-sm"
                                />
                                <div className="absolute left-3 top-2.5 text-slate-400">
                                    <ExternalLink className="h-4 w-4" />
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm text-red-500 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </p>
                            )}
                            {successMessage && (
                                <p className="text-sm text-green-600 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {successMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="space-y-2">
                        <Label>Live Preview</Label>
                        <div className="aspect-video w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900/50 overflow-hidden relative group">
                            {url ? (
                                <iframe
                                    src={url}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="xr-spatial-tracking; gyroscope; accelerometer"
                                    className={cn("w-full h-full transition-opacity duration-500", !isEnabled && "opacity-50")}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <Rotate3D className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium">Add a link to preview your tour</p>
                                </div>
                            )}

                            {!isEnabled && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                    <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl">
                                        Feature Disabled
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-2">
                            Preview shows how it will appear to guests on your hotel page.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-slate-100 bg-slate-50/50 p-6">
                    <Button
                        variant="ghost"
                        onClick={handleRemove}
                        disabled={isSaving || (!url && !isEnabled)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        Remove Tour
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
