import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { TaskService } from "@/lib/task-service";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ message: "Supabase not configured." }, { status: 200 });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const stats = TaskService.calculateStats(tasks || []);
    const weeklyChart = TaskService.getWeeklyChartData(tasks || []);

    return NextResponse.json({ stats, weeklyChart }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
