import { auth } from "@/lib/auth";
import { AuthButtons } from "@/components/auth-buttons";
import ProductExplorer from "@/components/ProductExplorer";

export default async function Page() {
  const session = await auth();

  return (
    <main className="p-8">
      {/* ส่วนแถบบนสุด: แสดงปุ่ม Sign in / Sign out */}
      <div className="flex justify-end items-center mb-6">
        <AuthButtons session={session} />
      </div>

      {/* ส่วนเนื้อหาหน้าเว็บหลัก */}
      <ProductExplorer />
    </main>
  );
}