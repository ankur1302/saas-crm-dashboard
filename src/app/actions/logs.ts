"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { triggerWebhook } from "@/lib/webhook";

export async function createLog(data: FormData) {
    const supabase = await createClient();

    const rawData = {
        title: data.get("title") as string,
        details: data.get("details") as string,
        lead_id: data.get("lead_id") as string,
        // category_id: data.get("category_id") as string, // Optional for now
        occurred_at: new Date().toISOString(),
    };

    const { data: log, error } = await supabase.from("logs").insert(rawData).select("id").single();

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "create", entity: "log", entityId: log.id });
    revalidatePath("/logs");
    return { success: true };
}

export async function updateLog(id: string, data: FormData) {
    const supabase = await createClient();

    const rawData = {
        title: data.get("title") as string,
        details: data.get("details") as string,
        lead_id: data.get("lead_id") as string,
        // lead_id should probably not change often, but can be
    };

    const { error } = await supabase.from("logs").update(rawData).eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "update", entity: "log", entityId: id });
    revalidatePath("/logs");
    return { success: true };
}

export async function deleteLog(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("logs").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "delete", entity: "log", entityId: id });
    revalidatePath("/logs");
    return { success: true };
}
