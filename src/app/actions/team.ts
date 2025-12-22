"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Only for demo/MVP purposes, we assume specific hardcoded logic or just querying what's available
// In a real app, strict RLS and Auth logic is crucial.

export async function getTeamMembers() {
    const supabase = await createClient();

    // For now, listing all users in team_members implies we know the current team ID
    const { data: members, error } = await supabase
        .from("team_members")
        .select("*");

    if (error) return [];
    return members;
}

export async function getInvitations() {
    const supabase = await createClient();
    const { data: invitations } = await supabase.from("invitations").select("*");
    return invitations || [];
}

import { triggerWebhook } from "@/lib/webhook";

export async function inviteUser(email: string, role: string) {
    const supabase = await createClient();

    // Generate a fake token for now
    const token = Math.random().toString(36).substring(7);

    // We need a team_id. Let's just grab the first team available or creating one if missing?
    const { data: teams } = await supabase.from("teams").select("id").limit(1);
    if (!teams || teams.length === 0) return { success: false, error: "No team found" };
    const teamId = teams[0].id;

    const { data: invitation, error } = await supabase.from("invitations").insert({
        email,
        role,
        team_id: teamId,
        token
    }).select("id").single();

    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "create", entity: "invitation", entityId: invitation.id });
    revalidatePath("/settings/team");
    return { success: true };
}

export async function cancelInvitation(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("invitations").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "delete", entity: "invitation", entityId: id });
    revalidatePath("/settings/team");
    return { success: true };
}

export async function removeMember(memberId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("team_members").delete().eq("id", memberId);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "delete", entity: "team_member", entityId: memberId });
    revalidatePath("/settings/team");
    return { success: true };
}

export async function updateMemberRole(memberId: string, role: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("team_members").update({ role }).eq("id", memberId);
    if (error) return { success: false, error: error.message };

    await triggerWebhook({ action: "update", entity: "team_member", entityId: memberId });
    revalidatePath("/settings/team");
    return { success: true };
}

export async function getCurrentUserRole() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Assuming single team for now, or just finding the first membership
    const { data: member } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", user.id)
        .single();

    return member?.role || null;
}
