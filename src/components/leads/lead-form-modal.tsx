"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { createLead, updateLead } from "@/app/actions/leads";

type Lead = {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string | null;
    phone?: string | null;
    company: string | null;
    status: string;
    priority: string;
};

export function LeadFormModal({
    children,
    initialData,
}: {
    children: React.ReactNode;
    initialData?: Lead;
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            if (initialData) {
                await updateLead(initialData.id, formData);
            } else {
                await createLead(formData);
            }
            setOpen(false);
        } catch (err) {
            setError("Failed to save lead. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900">
                            {initialData ? "Edit Lead" : "Create Lead"}
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    required
                                    defaultValue={initialData?.first_name}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    defaultValue={initialData?.last_name || ""}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email || ""}
                                className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Company
                            </label>
                            <input
                                id="company"
                                name="company"
                                defaultValue={initialData?.company || ""}
                                className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Acme Inc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={initialData?.status || "new"}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="proposal">Proposal</option>
                                    <option value="negotiation">Negotiation</option>
                                    <option value="closed_won">Closed Won</option>
                                    <option value="closed_lost">Closed Lost</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-xs font-semibold text-zinc-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    defaultValue={initialData?.priority || "medium"}
                                    className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {initialData ? "Save Changes" : "Create Lead"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
