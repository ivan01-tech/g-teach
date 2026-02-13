import Link from "next/link";


export default function NotAuthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
            <h1 className="text-2xl font-bold text-foreground">You are not authorized to access this page</h1>
            <Link href="/auth/login" className="text-primary hover:underline mt-4">
                Login
            </Link>
        </div>
    );
}