"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/lib/roles";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Save, Loader2 } from "lucide-react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

interface UserCreateDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function UserCreateDialog({
    isOpen,
    onOpenChange,
    onSuccess,
}: UserCreateDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Note: Administative user creation might require a cloud function or 
        // a specific auth-admin logic to avoid logging out the current admin.
        // For now, we'll use a placeholder logic or assume the userService handles it.

        toast({
            title: "Feature coming soon",
            description: "Administrative user creation requires protected backend implementation.",
        });

        setSubmitting(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                            Add New User
                        </DialogTitle>
                        <DialogDescription>
                            Create a new account manually.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Full Name</Label>
                            <Input
                                id="create-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-password">Initial Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-role">Role</Label>
                            <Select
                                value={role}
                                onValueChange={(value) => setRole(value as UserRole)}
                            >
                                <SelectTrigger id="create-role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={UserRole.Student}>Student</SelectItem>
                                    <SelectItem value={UserRole.Tutor}>Tutor</SelectItem>
                                    <SelectItem value={UserRole.Admin}>Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
