"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { createLog, updateLog } from "@/app/actions/logs";

type Log = {
    id: string;
    title: string;
    details: string | null;
    occurred_at: string;
    lead_id: string;
};

export function LogFormModal({
    children,
    initialData,
    leads = [],
}: {
    children: React.ReactNode;
    initialData?: Log;
    leads?: any[];
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
                await updateLog(initialData.id, formData);
            } else {
                await createLog(formData);
            }
            setOpen(false);
        } catch (err) {
            setError("Failed to save log. Please try again.");
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
                            {initialData ? "Edit Log" : "Create Log"}
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

                        <div>
                            <label htmlFor="title" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Log Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                required
                                defaultValue={initialData?.title}
                                className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Call Summary"
                            />
                        </div>

                        <div>
                            <label htmlFor="details" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Details
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                rows={3}
                                defaultValue={initialData?.details || ""}
                                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                                placeholder="Add log details..."
                            />
                        </div>

                        <div>
                            <label htmlFor="lead_id" className="block text-xs font-semibold text-zinc-700 mb-1">
                                Related Lead
                            </label>
                            <select
                                id="lead_id"
                                name="lead_id"
                                required
                                defaultValue={initialData?.lead_id || ""}
                                className="w-full h-9 rounded border border-zinc-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="" disabled>Select a lead</option>
                                {leads.map((lead) => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.first_name} {lead.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Hidden occurred_at field, defaulting to now on server if needed, or we can let user pick. For now, matching previous simplified form. */}

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
                                {initialData ? "Save Changes" : "Create Log"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
