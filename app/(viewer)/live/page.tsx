"use client";

import HLSPlayer from "@/components/player/HLSPlayer";
import { useLiveStream } from "@/hooks/useLiveStream";

export default function LivePage() {

  const stream = useLiveStream();

  if (!stream) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          We are currently offline
        </h1>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">

      <div className="aspect-video">

        {stream.stream_type==="hls" && (
          <HLSPlayer src={stream.stream_url}/>
        )}

        {stream.stream_type==="youtube" && (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${stream.stream_url}?autoplay=1`}
            allowFullScreen
          />
        )}

      </div>

      <div className="p-6">

        <div className="flex items-center gap-2 text-red-500 font-semibold">
          🔴 LIVE
        </div>

        <h1 className="text-3xl font-bold mt-3">
          {stream.title}
        </h1>

        <p className="text-gray-300 mt-2">
          {stream.description}
        </p>

      </div>

    </main>
  );
}