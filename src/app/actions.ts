"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function ensureTeam() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const db = supabaseAdmin();

  // 1) Do we already have a membership?
  const { data: existingMember, error: memberErr } = await db
    .from("members")
    .select("team_id, role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (memberErr) throw memberErr;
  if (existingMember?.team_id) return existingMember.team_id as string;

  // 2) Create team
  const teamName = "My Team"; // later: ask user; Day1 default is fine

  const { data: team, error: teamErr } = await db
    .from("teams")
    .insert({ name: teamName, owner_user_id: userId })
    .select("id")
    .single();

  if (teamErr) throw teamErr;

  // 3) Create membership as owner
  const { error: insertMemberErr } = await db
    .from("members")
    .insert({ team_id: team.id, user_id: userId, role: "owner" });

  if (insertMemberErr) throw insertMemberErr;

  return team.id as string;
}