"use client";

import { useEffect, useState } from "react";
import HLSPlayer from "@/components/player/HLSPlayer";
import { getCurrentStream, updateStream } from "@/lib/services/stream-service";

export default function StreamsPage() {
  const [stream, setStream] = useState<any>();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getCurrentStream();
    setStream(data);
  }

  async function save() {
    await updateStream(stream.id, stream);
    alert("Broadcast updated successfully");
  }

  if (!stream) return null;

  return (
    <main className="p-8 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-2xl font-bold mb-5">
            Broadcast Control
          </h2>

          <input
            className="w-full border p-3 rounded-lg mb-4"
            value={stream.title}
            onChange={(e)=>
              setStream({...stream,title:e.target.value})
            }
          />

          <textarea
            className="w-full border p-3 rounded-lg mb-4"
            rows={4}
            value={stream.description || ""}
            onChange={(e)=>
              setStream({...stream,description:e.target.value})
            }
          />

          <select
            className="w-full border p-3 rounded-lg mb-4"
            value={stream.stream_type}
            onChange={(e)=>
              setStream({...stream,stream_type:e.target.value})
            }
          >
            <option value="hls">OBS / HLS</option>
            <option value="youtube">YouTube</option>
            <option value="embed">Embed</option>
          </select>

          <input
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="HLS URL"
            value={stream.stream_url || ""}
            onChange={(e)=>
              setStream({...stream,stream_url:e.target.value})
            }
          />

          <div className="flex items-center justify-between mb-5">
            <span className="font-semibold">Live Status</span>

            <button
              onClick={() =>
                setStream({
                  ...stream,
                  is_live: !stream.is_live,
                  started_at: !stream.is_live
                    ? new Date().toISOString()
                    : null,
                })
              }
              className={`px-4 py-2 rounded-lg text-white ${
                stream.is_live ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {stream.is_live ? "END LIVE" : "GO LIVE"}
            </button>
          </div>

          <button
            onClick={save}
            className="w-full bg-blue-700 text-white p-3 rounded-lg"
          >
            Save Broadcast
          </button>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-2xl font-bold mb-5">
            Live Preview
          </h2>

          <div className="aspect-video rounded-xl overflow-hidden bg-black">

            {stream.stream_type==="hls" && (
              <HLSPlayer src={stream.stream_url}/>
            )}

          </div>

          <div className="mt-5">

            <div className="flex items-center gap-2">

              <div
                className={`h-3 w-3 rounded-full ${
                  stream.is_live ? "bg-red-500" : "bg-gray-400"
                }`}
              />

              <span className="font-semibold">
                {stream.is_live ? "LIVE" : "OFFLINE"}
              </span>

            </div>

            <h3 className="text-xl font-bold mt-3">
              {stream.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {stream.description}
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}