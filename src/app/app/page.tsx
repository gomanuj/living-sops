import { ensureTeam } from "./actions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AppDashboard() {
  const teamId = await ensureTeam();
  const db = supabaseAdmin();

  const { data: sops, error } = await db
    .from("sops")
    .select("id,title,status,created_at")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SOPs</h1>
        <Button>Create SOP</Button>
      </div>

      {(!sops || sops.length === 0) ? (
        <Card className="p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">No SOPs yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first SOP from a Loom, audio/video upload, or pasted notes.
            </p>
            <Button variant="secondary">Create your first SOP</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sops.map((s) => (
            <Card key={s.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.status}</div>
              </div>
              <Button variant="outline">Open</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}