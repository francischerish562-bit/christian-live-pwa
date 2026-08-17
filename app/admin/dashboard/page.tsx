import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!admin) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white p-5">
        <h1 className="text-2xl font-bold">
          Welcome, {admin.full_name}
        </h1>
      </header>

      <section className="p-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold">
            Streaming Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            OBS, YouTube and HLS controls will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}