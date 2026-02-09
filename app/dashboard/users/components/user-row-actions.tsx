"use client";

import { useState } from "react";
import { User } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    UserCheck,
    ExternalLink
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { deleteUserThunk } from "../redux/users-thunks";
import { TutorValidationDialog } from "./tutor-validation-dialog";
import { UserEditDialog } from "./user-edit-dialog";

interface UserRowActionsProps {
    user: User;
    onRefresh?: () => void;
}

export function UserRowActions({ user }: UserRowActionsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${user.displayName}?`)) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteUserThunk({ uid: user.uid, role: user.role })).unwrap();
            toast({
                title: "User deleted",
                description: `${user.displayName} has been removed successfully.`,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error || "Failed to delete user.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </DropdownMenuItem>

                {user.role === "tutor" && (
                    <DropdownMenuItem onClick={() => setShowValidation(true)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Validate Tutor
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => { }}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                    disabled={isDeleting}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>

            {user.role === "tutor" && (
                <TutorValidationDialog
                    tutorId={user.uid}
                    isOpen={showValidation}
                    onOpenChange={setShowValidation}
                />
            )}

            <UserEditDialog
                user={user}
                isOpen={showEdit}
                onOpenChange={setShowEdit}
            />
        </DropdownMenu>
    );
}
