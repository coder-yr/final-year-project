"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MoreVertical,
    Phone,
    Video,
    Send,
    Paperclip,
    Mic,
    Smile,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    where,
    Timestamp
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { Conversation, Message } from "@/lib/types";
import { format } from "date-fns";

export function MessagesView() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Conversations
    useEffect(() => {
        const q = query(
            collection(db, "conversations"),
            orderBy("lastMessageAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Conversation[];
            setConversations(data);
            if (data.length > 0 && !selectedConversation) {
                // Optionally select the first one, but let's leave it to user
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch Messages for Selected Conversation
    useEffect(() => {
        if (!selectedConversation) return;

        const q = query(
            collection(db, "conversations", selectedConversation.id, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);

            // Mark as read (Admin side reset badminUnreadCount)
            if (selectedConversation.adminUnreadCount > 0) {
                updateDoc(doc(db, "conversations", selectedConversation.id), {
                    adminUnreadCount: 0
                });
            }
        });

        return () => unsubscribe();
    }, [selectedConversation]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedConversation || !user) return;

        const text = inputMessage.trim();
        setInputMessage("");

        try {
            // 1. Add message
            await addDoc(collection(db, "conversations", selectedConversation.id, "messages"), {
                text,
                senderId: user.id,
                createdAt: serverTimestamp(),
                readBy: [user.id],
                isAdmin: true
            });

            // 2. Update conversation
            await updateDoc(doc(db, "conversations", selectedConversation.id), {
                lastMessage: text,
                lastMessageAt: serverTimestamp(),
                userUnreadCount: (selectedConversation.userUnreadCount || 0) + 1
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const getOtherParticipant = (conv: Conversation) => {
        if (!conv.participantsData) return { name: "Unknown", avatar: "", initials: "?" };
        // Since this is admin view, we look for the non-admin participant usually, 
        // but let's assume participantsData[0] is user if we created it that way.
        // Better: find the one that is NOT the current admin? 
        // For simplicity, let's take the first one or valid one.
        return conv.participantsData[0] || { name: "Guest", avatar: "", initials: "G" };
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return format(date, "h:mm a");
    };

    const formatThreadTime = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return format(date, "MMM d");
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Sidebar List */}
            <Card className="w-80 flex flex-col border-none shadow-md overflow-hidden bg-white">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-9 bg-slate-50 border-none rounded-xl"
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground text-sm">
                                No conversations yet.
                            </div>
                        ) : (
                            conversations.map((thread) => {
                                const participant = getOtherParticipant(thread);
                                return (
                                    <button
                                        key={thread.id}
                                        onClick={() => setSelectedConversation(thread)}
                                        className={cn(
                                            "w-full flex items-start gap-3 p-3 text-left rounded-xl transition-colors",
                                            selectedConversation?.id === thread.id
                                                ? "bg-slate-100 dark:bg-slate-800"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={participant.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                                    {participant.name?.[0] || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Online status indicator can be added later */}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-semibold text-sm truncate">{participant.name}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {formatThreadTime(thread.lastMessageAt)}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-xs truncate",
                                                thread.adminUnreadCount > 0 ? "font-bold text-slate-900" : "text-muted-foreground"
                                            )}>
                                                {thread.lastMessage || "No messages"}
                                            </p>
                                        </div>
                                        {thread.adminUnreadCount > 0 && (
                                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-600">
                                                {thread.adminUnreadCount}
                                            </Badge>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Window */}
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden bg-white">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        {getOtherParticipant(selectedConversation).name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-sm">{getOtherParticipant(selectedConversation).name}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        Active
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-slate-400">
                                <Button variant="ghost" size="icon" className="hover:text-slate-900 rounded-full">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-slate-900 rounded-full">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-slate-900 rounded-full">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                            <div className="space-y-4">
                                {messages.map((msg, index) => {
                                    const isMe = msg.isAdmin || msg.senderId === user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex gap-2 max-w-[80%]",
                                                isMe ? "ml-auto flex-row-reverse" : ""
                                            )}
                                        >
                                            {!isMe && (
                                                <Avatar className="h-8 w-8 mt-1">
                                                    <AvatarFallback className="text-xs">
                                                        {getOtherParticipant(selectedConversation).name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div>
                                                <div
                                                    className={cn(
                                                        "p-3 rounded-2xl text-sm shadow-sm",
                                                        isMe
                                                            ? "bg-slate-900 text-white rounded-br-none"
                                                            : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                                                    )}
                                                >
                                                    {msg.text}
                                                </div>
                                                <p className={cn("text-[10px] text-slate-400 mt-1", isMe ? "text-right" : "")}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t">
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full shrink-0">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 h-9"
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full shrink-0">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                {inputMessage ? (
                                    <Button
                                        onClick={handleSendMessage}
                                        size="icon"
                                        className="h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-full shrink-0 transition-all"
                                    >
                                        <Send className="h-4 w-4 text-white" />
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full shrink-0">
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-slate-900">Select a conversation</h3>
                        <p className="max-w-sm">
                            Choose a thread from the left sidebar to view messages and reply to customers.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
