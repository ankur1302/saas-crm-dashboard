"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/logger";

export async function createTask(data: FormData) {
    const supabase = await createClient();
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) {
        return { success: false, error: "Unauthorized" };
    }

    const rawData = {
        title: data.get("title") as string,
        description: data.get("description") as string,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
        due_date: data.get("due_date") ? (data.get("due_date") as string) : null,
        assigned_to: userResponse.data.user.id,
    };

    const { data: task, error } = await supabase.from("tasks").insert(rawData).select("id").single();

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "created",
        entityType: "TASK",
        entityId: task.id,
        message: `Task '${rawData.title}' was created`,
        title: "Task Created",
    });

    revalidatePath("/tasks");
    return { success: true };
}

export async function updateTask(id: string, data: FormData) {
    const supabase = await createClient();

    const rawData = {
        title: data.get("title") as string,
        description: data.get("description") as string,
        status: data.get("status") as string,
        priority: data.get("priority") as string,
        due_date: data.get("due_date") ? (data.get("due_date") as string) : null,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from("tasks")
        .update(rawData)
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "updated",
        entityType: "TASK",
        entityId: id,
        message: `Task '${rawData.title}' was updated`,
        title: "Task Updated",
    });

    revalidatePath("/tasks");
    return { success: true };
}

export async function deleteTask(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Log the action
    await logAction({
        action: "deleted",
        entityType: "TASK",
        entityId: id,
        message: "Task was deleted",
        title: "Task Deleted",
    });

    revalidatePath("/tasks");
    return { success: true };
}
