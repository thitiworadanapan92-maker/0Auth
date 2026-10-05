import { signIn, signOut } from "@/lib/auth";

export function AuthButtons({ session }: { session?: any }) {
  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
        >
          Sign Out
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google"); // 👈 ต้องมี "google" กำหนดตรงนี้
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </form>
  );
}