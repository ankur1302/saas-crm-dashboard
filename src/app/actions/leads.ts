"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { triggerWebhook } from "@/lib/webhook";
import { logAction } from "@/lib/logger";

export async function createLead(data: FormData) {
    const supabase = await createClient();

    const rawData = {
        first_name: data.get("first_name") as string,
        last_name: data.get("last_name") as string,
        email: data.get("email") as string,
        company: data.get("company") as string,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
        // Add default values or handle optional fields if needed
        source: "Manual",
    };

    const { data: lead, error } = await supabase.from("leads").insert(rawData).select("id, first_name, last_name").single();

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "created",
        entityType: "LEAD",
        entityId: lead.id,
        message: `Lead '${lead.first_name} ${lead.last_name}' was created`,
        title: "Lead Created",
    });

    await triggerWebhook({ action: "create", entity: "lead", entityId: lead.id });
    revalidatePath("/leads");
    return { success: true };
}

export async function updateLead(id: string, data: FormData) {
    const supabase = await createClient();

    const rawData = {
        first_name: data.get("first_name") as string,
        last_name: data.get("last_name") as string,
        email: data.get("email") as string,
        company: data.get("company") as string,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
    };

    const { error } = await supabase
        .from("leads")
        .update(rawData)
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "updated",
        entityType: "LEAD",
        entityId: id,
        message: `Lead '${rawData.first_name} ${rawData.last_name}' was updated`,
        title: "Lead Updated",
    });

    await triggerWebhook({ action: "update", entity: "lead", entityId: id });
    revalidatePath("/leads");
    return { success: true };
}

export async function deleteLead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "deleted",
        entityType: "LEAD",
        entityId: id,
        message: "Lead was deleted",
        title: "Lead Deleted",
    });

    await triggerWebhook({ action: "delete", entity: "lead", entityId: id });
    revalidatePath("/leads");
    return { success: true };
}

export async function deleteLeads(ids: string[]) {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().in("id", ids);

    if (error) {
        return { success: false, error: error.message };
    }

    // Trigger for each deleted lead - parallelized
    ids.forEach(id => triggerWebhook({ action: "delete", entity: "lead", entityId: id }));

    revalidatePath("/leads");
    return { success: true };
}

export async function importLeads(leads: any[]) {
    const supabase = await createClient();

    const { error } = await supabase.from("leads").insert(leads);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/leads");
    return { success: true };
}
