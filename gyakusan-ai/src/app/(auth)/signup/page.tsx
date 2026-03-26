import { redirect } from "next/navigation";

import SignupForm from "@/components/auth/SignupForm";
import { getCurrentUser } from "@/lib/auth/server";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <div className="px-4">
        <SignupForm />
      </div>
    </main>
  );
}

