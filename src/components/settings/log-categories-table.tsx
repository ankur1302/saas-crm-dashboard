"use client";

import { Edit, Trash2, MoreHorizontal } from "lucide-react";

type Category = {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    color: string | null;
};

export function LogCategoriesTable({ categories }: { categories: Category[] }) {
    const displayCategories = categories || [];

    return (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-zinc-500">Category Name</th>
                        <th className="px-4 py-2 font-semibold text-zinc-500">Description</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayCategories.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                No categories found.
                            </td>
                        </tr>
                    ) : (
                        displayCategories.map((cat) => (
                            <tr key={cat.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                                <td className="px-4 py-2 font-medium text-zinc-900 flex items-center gap-2">
                                    {cat.color && (
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                    )}
                                    {cat.name}
                                </td>
                                <td className="px-4 py-2 text-zinc-500">{cat.description || "-"}</td>
                                <td className="px-4 py-2 text-right">
                                    <button className="text-zinc-400 hover:text-zinc-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
