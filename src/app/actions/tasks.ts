"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { triggerWebhook } from "@/lib/webhook";

export async function createTask(data: FormData) {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const userId = userData.data.user?.id;

    const rawData = {
        title: data.get("title") as string,
        description: data.get("description") as string,
        due_date: data.get("due_date") ? new Date(data.get("due_date") as string).toISOString() : null,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
        lead_id: (data.get("lead_id") as string) || null,
        assigned_to: data.get("assign_to_me") === "on" ? userId : null,
    };

    const { data: task, error } = await supabase.from("tasks").insert(rawData).select("id").single();

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "create", entity: "task", entityId: task.id });
    revalidatePath("/tasks");
    return { success: true };
}

export async function updateTask(id: string, data: FormData) {
    const supabase = await createClient();
    const userData = await supabase.auth.getUser();
    const userId = userData.data.user?.id;

    const rawData: any = {
        title: data.get("title") as string,
        description: data.get("description") as string,
        due_date: data.get("due_date") ? new Date(data.get("due_date") as string).toISOString() : null,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
        lead_id: (data.get("lead_id") as string) || null,
    };

    if (data.get("assign_to_me") === "on") {
        rawData.assigned_to = userId;
    }

    const { error } = await supabase.from("tasks").update(rawData).eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "update", entity: "task", entityId: id });
    revalidatePath("/tasks");
    return { success: true };
}

export async function deleteTask(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    await triggerWebhook({ action: "delete", entity: "task", entityId: id });
    revalidatePath("/tasks");
    return { success: true };
}
