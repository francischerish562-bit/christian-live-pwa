"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");

    const email = "admin@christianlive.app";

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single();

    if (!admin || username !== admin.username) {
      await supabase.auth.signOut();
      setError("Invalid username");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">
            Christian Live
          </h1>
          <p className="text-gray-500 mt-2">Administrator Login</p>
        </div>

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-700 text-white rounded-lg p-3 font-semibold"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </main>
  );
}