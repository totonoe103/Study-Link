import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/server";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <div className="px-4">
        <LoginForm />
      </div>
    </main>
  );
}

