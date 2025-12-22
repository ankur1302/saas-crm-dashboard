import { getInvitations, getTeamMembers, getCurrentUserRole } from "@/app/actions/team";
import { MembersTable } from "@/components/team/members-table";
import { InviteMemberModal } from "@/components/team/invite-member-modal";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
    const members = await getTeamMembers();
    const invitations = await getInvitations();
    const userRole = await getCurrentUserRole();
    const isAdminOrOwner = userRole === "admin" || userRole === "owner";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/settings" className="p-2 -ml-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Team Management
                </h1>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div>
                    <h2 className="text-sm font-medium text-zinc-900">Invite Members</h2>
                    <p className="text-xs text-zinc-500">
                        Allow others to join your team and collaborate.
                    </p>
                </div>
                {isAdminOrOwner && (
                    <InviteMemberModal>
                        <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Invite
                        </button>
                    </InviteMemberModal>
                )}
            </div>

            <MembersTable members={members || []} invitations={invitations || []} userRole={userRole} />
        </div>
    );
}
