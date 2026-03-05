"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function ensureTeam() {
  return "test";
}
// export async function ensureTeam() {
//   const { userId } = await auth();
//   console.log("actions file loaded");
//   if (!userId) {
//     throw new Error("User not authenticated");
//   }

//   const db = supabaseAdmin();

//   const { data: member } = await db
//     .from("members")
//     .select("team_id")
//     .eq("user_id", userId)
//     .maybeSingle();

//   if (member?.team_id) {
//     return member.team_id;
//   }

//   const { data: team } = await db
//     .from("teams")
//     .insert({
//       name: "My Team",
//       owner_user_id: userId,
//     })
//     .select()
//     .single();

//   await db.from("members").insert({
//     team_id: team.id,
//     user_id: userId,
//     role: "owner",
//   });

//   return team.id;
// }