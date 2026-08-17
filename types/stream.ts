export type StreamType = "hls" | "youtube" | "embed";

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  stream_type: StreamType;
  stream_url: string;
  embed_url: string | null;
  thumbnail_url: string | null;
  is_live: boolean;
  viewer_count: number;
  started_at: string | null;
  scheduled_at: string | null;
}