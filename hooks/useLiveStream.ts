"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLiveStream() {
  const supabase = createClient();
  const [stream, setStream] = useState<any>(null);

  async function fetchStream() {
    const { data } = await supabase
      .from("live_streams")
      .select("*")
      .eq("is_live", true)
      .maybeSingle();

    setStream(data);
  }

  useEffect(() => {
    fetchStream();

    const channel = supabase
      .channel("stream-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_streams",
        },
        () => fetchStream()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return stream;
}