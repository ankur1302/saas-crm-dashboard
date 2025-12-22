"use client";

import { Bell, Search, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Header() {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="flex h-14 items-center gap-4 bg-white px-6 shadow-sm z-20">
            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                        type="search"
                        placeholder="Global search..."
                        className="w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-zinc-500 hover:text-zinc-700">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-4 w-px bg-zinc-200" />
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="flex items-center gap-2 outline-none">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User className="h-4 w-4" />
                            </div>
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="mr-6 mt-2 w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg z-50">
                            <DropdownMenu.Item className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-zinc-700 outline-none hover:bg-zinc-100">
                                Profile
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-zinc-700 outline-none hover:bg-zinc-100">
                                Settings
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-zinc-100" />
                            <DropdownMenu.Item
                                onSelect={handleSignOut}
                                className="flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50"
                            >
                                Sign out
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </header>
    );
}
