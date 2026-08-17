import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getCurrentStream() {
  const { data, error } = await supabase
    .from("live_streams")
    .select("*")
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

export async function updateStream(id: string, payload: any) {
  const { error } = await supabase
    .from("live_streams")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}