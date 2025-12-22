"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { triggerWebhook } from "@/lib/webhook";

// --- Lead Categories ---

export async function createLeadCategory(data: FormData) {
    const supabase = await createClient();
    const rawData = {
        name: data.get("name") as string,
        color: data.get("color") as string,
    };

    const { data: category, error } = await supabase.from("lead_categories").insert(rawData).select("id").single();
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "create", entity: "lead_category", entityId: category.id });
    revalidatePath("/settings/lead-categories");
    return { success: true };
}

export async function updateLeadCategory(id: string, data: FormData) {
    const supabase = await createClient();
    const rawData = {
        name: data.get("name") as string,
        color: data.get("color") as string,
    };

    const { error } = await supabase.from("lead_categories").update(rawData).eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "update", entity: "lead_category", entityId: id });
    revalidatePath("/settings/lead-categories");
    return { success: true };
}

export async function deleteLeadCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("lead_categories").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "delete", entity: "lead_category", entityId: id });
    revalidatePath("/settings/lead-categories");
    return { success: true };
}

// --- Log Categories ---

export async function createLogCategory(data: FormData) {
    const supabase = await createClient();
    const rawData = {
        name: data.get("name") as string,
        // icon: data.get("icon") as string, // Optional
    };

    const { data: category, error } = await supabase.from("log_categories").insert(rawData).select("id").single();
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "create", entity: "log_category", entityId: category.id });
    revalidatePath("/settings/log-categories");
    return { success: true };
}

export async function updateLogCategory(id: string, data: FormData) {
    const supabase = await createClient();
    const rawData = {
        name: data.get("name") as string,
        // icon: data.get("icon") as string,
    };

    const { error } = await supabase.from("log_categories").update(rawData).eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "update", entity: "log_category", entityId: id });
    revalidatePath("/settings/log-categories");
    return { success: true };
}

export async function deleteLogCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("log_categories").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "delete", entity: "log_category", entityId: id });
    revalidatePath("/settings/log-categories");
    return { success: true };
}
