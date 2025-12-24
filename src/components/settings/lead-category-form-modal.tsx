"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function LeadCategoryFormModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl focus:outline-none z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <Dialog.Title className="text-xl font-semibold text-zinc-900">
                            Edit Categories
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-2 hover:bg-zinc-200/50 text-zinc-400 hover:text-zinc-600 transition-all duration-200">
                            <X className="h-5 w-5" />
                        </Dialog.Close>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-50/50 rounded-xl border-2 border-dashed border-zinc-200">
                            <div className="p-3 bg-zinc-100 rounded-full mb-3">
                                <span className="text-2xl">🚧</span>
                            </div>
                            <h3 className="text-sm font-medium text-zinc-900">Coming Soon</h3>
                            <p className="text-sm text-zinc-500 mt-1 max-w-xs">Category management is currently under development.</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
                         <Dialog.Close asChild>
                            <button
                                type="button"
                                className="h-10 px-5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 bg-white hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-200"
                            >
                                Close
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
