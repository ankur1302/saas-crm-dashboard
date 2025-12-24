"use client";

import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";

type Log = {
    id: string;
    title: string;
    details: string | null;
    occurred_at: string;
    action: string | null;
    entity_type: string | null;
    lead_id: string;
    leads: {
        first_name: string;
        last_name: string | null;
    } | null;
};

export function LogsTable({ logs }: { logs: Log[] }) {
    return (
        <div className="flex flex-col h-full bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-6"></th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activity</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-zinc-500 text-sm">
                                    No activity logs yet. Logs will appear here automatically when you create, update, or delete tasks and leads.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-2 text-zinc-400">
                                        <Info className="h-4 w-4" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="font-medium text-zinc-900 text-sm">{log.title}</div>
                                        {log.details && (
                                            <p className="text-xs text-zinc-500 truncate max-w-[500px] mt-0.5">{log.details}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {log.entity_type && (
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${
                                                log.entity_type === 'TASK' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                log.entity_type === 'LEAD' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-zinc-100 text-zinc-700 border-zinc-200'
                                            }`}>
                                                {log.entity_type.toLowerCase()}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-zinc-500 text-xs whitespace-nowrap">
                                        {formatDistanceToNow(new Date(log.occurred_at), { addSuffix: true })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
