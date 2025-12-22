"use client";

import { useState } from "react";
import { Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError("An unexpected error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-xl border border-zinc-200">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Sign in to CRM
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full h-10 px-3 border border-zinc-300 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 text-sm"
                                placeholder="name@company.com"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-1.5"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full h-10 px-3 border border-zinc-300 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 text-sm"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2.5 px-4 rounded bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <div className="text-center text-sm border-t border-zinc-100 pt-6">
                    <span className="text-zinc-500">
                        Don't have an account?{" "}
                    </span>
                    <Link
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Contact Admin
                    </Link>
                </div>
            </div>
        </div>
    );
}
