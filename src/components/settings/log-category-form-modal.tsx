"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function LogCategoryFormModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900">
                            Edit Log Categories
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-1.5 hover:bg-zinc-100">
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>
                    <p className="text-sm text-zinc-500">Category management coming soon.</p>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
