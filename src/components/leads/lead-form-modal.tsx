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
                <Dialog.Overlay className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl focus:outline-none z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                        <Dialog.Title className="text-xl font-semibold text-zinc-900">
                            {initialData ? "Edit Lead" : "Create New Lead"}
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-2 hover:bg-zinc-200/50 text-zinc-400 hover:text-zinc-600 transition-all duration-200">
                            <X className="h-5 w-5" />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center shadow-sm">
                                    <span className="bg-red-100 p-1 rounded-full mr-2">
                                        <X className="w-3 h-3" />
                                    </span>
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="first_name" className="text-sm font-medium text-zinc-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        required
                                        defaultValue={initialData?.first_name}
                                        className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="last_name" className="text-sm font-medium text-zinc-700">
                                        Last Name
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        defaultValue={initialData?.last_name || ""}
                                        className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={initialData?.email || ""}
                                    className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="company" className="text-sm font-medium text-zinc-700">
                                    Company
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    defaultValue={initialData?.company || ""}
                                    className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-400"
                                    placeholder="Acme Inc."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="status" className="text-sm font-medium text-zinc-700">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue={initialData?.status || "new"}
                                            className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="proposal">Proposal</option>
                                            <option value="negotiation">Negotiation</option>
                                            <option value="closed_won">Closed Won</option>
                                            <option value="closed_lost">Closed Lost</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="priority" className="text-sm font-medium text-zinc-700">
                                        Priority
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="priority"
                                            name="priority"
                                            defaultValue={initialData?.priority || "medium"}
                                            className="w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm transition-all outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="h-10 px-5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 bg-white hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="h-10 px-6 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center"
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
