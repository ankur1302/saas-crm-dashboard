"use client";

import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Category = {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    color: string | null;
};

export function LeadCategoriesTable({ categories }: { categories: Category[] }) {
    // If no categories passed, fall back or show empty? 
    // The page passes categories=[] if null.
    // We can also fallback to empty array here just in case.
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
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button className="text-zinc-400 hover:text-zinc-600">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="min-w-[140px] bg-white border border-zinc-200 rounded-md shadow-lg p-1 z-50">
                                                <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-zinc-50 text-zinc-700 outline-none">
                                                    <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                                    Edit
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item className="flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-red-50 text-red-600 outline-none">
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                    Delete
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function LogCategoriesTable() {
    const categories = [
        { id: "1", name: "Type", values: ["Call", "Email", "Meeting", "Note"] },
    ];

    return (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-zinc-500">Category Name</th>
                        <th className="px-4 py-2 font-semibold text-zinc-500">Values</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                            <td className="px-4 py-2 font-medium text-zinc-900">{cat.name}</td>
                            <td className="px-4 py-2 text-zinc-500">{cat.values.join(", ")}</td>
                            <td className="px-4 py-2 text-right">
                                <button className="text-zinc-400 hover:text-zinc-600">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
