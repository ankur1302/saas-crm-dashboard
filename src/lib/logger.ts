"use server";

import { createClient } from "@/lib/supabase/server";

type LogActionParams = {
    action: string;
    entityType: string;
    entityId: string;
    message: string;
    title?: string;
};

/**
 * Log an action to the logs table.
 * This function runs silently and will NOT throw errors to avoid breaking main CRUD operations.
 */
export async function logAction(params: LogActionParams) {
    try {
        const supabase = await createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.error("[Logger] No authenticated user found");
            return;
        }

        const logData = {
            title: params.title || `${params.entityType} ${params.action}`,
            details: params.message,
            action: params.action,
            entity_type: params.entityType,
            entity_id: params.entityId,
            user_id: user.id,
            occurred_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("logs").insert(logData);

        if (error) {
            console.error("[Logger] Failed to insert log:", error.message);
        }
    } catch (err) {
        console.error("[Logger] Unexpected error:", err);
    }
}
