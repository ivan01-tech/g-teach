"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { UserRowActions } from "./user-row-actions";

interface UserTableProps {
    users: User[];
    loading: boolean;
    onRefresh: () => void;
}

export function UserTable({ users, loading, onRefresh }: UserTableProps) {
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">No users found.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                                        <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
                                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
                                            {user.displayName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{user.displayName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        user.role === "admin"
                                            ? "border-blue-500 text-blue-600 bg-blue-50"
                                            : user.role === "tutor"
                                                ? "border-purple-500 text-purple-600 bg-purple-50"
                                                : "border-emerald-500 text-emerald-600 bg-emerald-50"
                                    }
                                >
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {user.createdAt ? format(user.createdAt, "MMM d, yyyy") : "N/A"}
                                </span>
                            </TableCell>
                            <TableCell>
                                {user.role === "tutor" ? (
                                    <Badge
                                        variant="secondary"
                                        className="capitalize"
                                    >
                                        {/* Placeholder for verification status if available on main User type */}
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Active</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <UserRowActions user={user} onRefresh={onRefresh} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
