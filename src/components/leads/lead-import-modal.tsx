"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { importLeads } from "@/app/actions/leads";

export function LeadImportModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Basic preview of first 5 rows (excluding header if possible, or just raw)
            setPreview(json.slice(0, 5));
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleImport = async () => {
        if (!file) return;
        setIsLoading(true);

        // Convert file to FormData or process JSON client side and send
        // For simplicity, let's just pretend we send the JSON
        // In reality, we'd use the server action

        // This is a placeholder for the actual import logic
        setTimeout(() => {
            setIsLoading(false);
            setOpen(false);
            setFile(null);
            setPreview([]);
        }, 1500);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-blue-600" />
                            Import Leads
                        </Dialog.Title>
                        <Dialog.Close className="rounded-full p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                            <X className="h-4 w-4" />
                        </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:bg-zinc-50 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                            >
                                <Upload className="h-8 w-8 text-zinc-400" />
                                <span className="text-sm font-medium text-zinc-700">
                                    {file ? file.name : "Click to upload CSV or Excel"}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    Max file size: 5MB
                                </span>
                            </label>
                        </div>

                        {preview.length > 0 && (
                            <div className="border border-zinc-200 rounded-lg overflow-hidden">
                                <div className="bg-zinc-50 px-3 py-2 border-b border-zinc-200 text-xs font-semibold text-zinc-700">
                                    Preview
                                </div>
                                <div className="overflow-x-auto max-h-40">
                                    <table className="w-full text-xs text-left">
                                        <tbody>
                                            {preview.map((row, i) => (
                                                <tr key={i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                                                    {Object.values(row).map((cell: any, j) => (
                                                        <td key={j} className="px-3 py-1.5 whitespace-nowrap text-zinc-600">
                                                            {String(cell)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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
                                onClick={handleImport}
                                disabled={!file || isLoading}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Import Data
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
