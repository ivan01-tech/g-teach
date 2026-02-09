"use client";

import { useState, useEffect } from "react";
import { Tutor, VerificationStatus } from "@/lib/types";
import { userService } from "@/lib/services/user-service";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
    FileText,
    ExternalLink,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    User
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { validateTutorThunk } from "../redux/users-thunks";

interface TutorValidationDialogProps {
    tutorId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function TutorValidationDialog({
    tutorId,
    isOpen,
    onOpenChange,
    onSuccess,
}: TutorValidationDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && tutorId) {
            fetchTutorDetails();
        }
    }, [isOpen, tutorId]);

    const fetchTutorDetails = async () => {
        setLoading(true);
        try {
            const data = await userService.getTutorDetails(tutorId);
            setTutor(data);
            setMessage(data?.verificationMessage || "");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch tutor details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async (status: VerificationStatus) => {
        setSubmitting(true);
        try {
            await dispatch(validateTutorThunk({ uid: tutorId, status, message })).unwrap();
            toast({
                title: `Tutor ${status}`,
                description: `The tutor has been ${status} successfully.`,
            });
            onSuccess?.();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error || `Failed to ${status} tutor.`,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <ShieldCheck className="h-6 w-6 text-blue-500" />
                        Tutor Validation
                    </DialogTitle>
                    <DialogDescription>
                        Review the tutor's profile and documents to verify their application.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : tutor ? (
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-6 py-4">
                            {/* Profile Summary */}
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-muted">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                                    {tutor.displayName?.charAt(0) || "T"}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-lg font-semibold">{tutor.displayName}</h3>
                                    <p className="text-sm text-muted-foreground">{tutor.email}</p>
                                    <div className="flex gap-2 pt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {tutor.languages.join(", ")}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {tutor.hourlyRate} {tutor.currency}/hr
                                        </Badge>
                                    </div>
                                </div>
                                <Badge
                                    className={
                                        tutor.verificationStatus === "verified"
                                            ? "bg-emerald-500"
                                            : tutor.verificationStatus === "rejected"
                                                ? "bg-red-500"
                                                : "bg-amber-500"
                                    }
                                >
                                    {tutor.verificationStatus}
                                </Badge>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    Bio & Introduction
                                </h4>
                                <p className="text-sm text-foreground bg-muted/20 p-3 rounded-md line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                                    {tutor.bio || "No bio provided."}
                                </p>
                            </div>

                            {/* Documents */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-500" />
                                    Uploaded Documents ({tutor.documents.length})
                                </h4>
                                <div className="grid gap-2">
                                    {tutor.documents.length > 0 ? (
                                        tutor.documents.map((doc: any) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium capitalize">{doc.type}</span>
                                                        <span className="text-xs text-muted-foreground">{doc.name}</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" asChild>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No documents uploaded.</p>
                                    )}
                                </div>
                            </div>

                            {/* Validation Message */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Feedback / Reason (Optional)</h4>
                                <Textarea
                                    placeholder="Provide feedback to the tutor or reason for rejection..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">Tutor not found.</div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => handleValidate("rejected")}
                        disabled={submitting || !tutor}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                    </Button>
                    <Button
                        onClick={() => handleValidate("verified")}
                        disabled={submitting || !tutor}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Tutor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
