import { ensureTeam } from "./actions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function Dashboard() {
  const teamId = await ensureTeam();

  const db = supabaseAdmin();

  const { data: sops } = await db
    .from("sops")
    .select("*")
    .eq("team_id", teamId);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      {(!sops || sops.length === 0) && (
        <div>
          <h2>No SOPs yet</h2>
          <p>Create your first SOP.</p>
        </div>
      )}
    </div>
  );
}