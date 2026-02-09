"use client";

import { useState, useEffect } from "react";
import { UserTable } from "./components/user-table";
import { UserCreateDialog } from "./components/user-create-dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";

export default function UsersPage() {
    const { users, loading } = useAppSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreate, setShowCreate] = useState(false);


    const filteredUsers = users.filter((user) =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage your students, tutors, and administrators.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setShowCreate(true)}
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            <UserCreateDialog
                isOpen={showCreate}
                onOpenChange={setShowCreate}
                onSuccess={() => { }}
            />

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-linear-to-br from-blue-500/10 via-transparent to-transparent border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
                        <CardDescription className="text-2xl font-bold text-foreground">{users.length}</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-linear-to-br from-purple-500/10 via-transparent to-transparent border-purple-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Tutors</CardTitle>
                        <CardDescription className="text-2xl font-bold text-foreground">
                            {users.filter(u => u.role === "tutor").length}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className="bg-linear-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Students</CardTitle>
                        <CardDescription className="text-2xl font-bold text-foreground">
                            {users.filter(u => u.role === "student").length}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                className="pl-9 bg-white dark:bg-slate-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <UserTable
                        users={filteredUsers}
                        loading={loading}
                        onRefresh={() => { }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
