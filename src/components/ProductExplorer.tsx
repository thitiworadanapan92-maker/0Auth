"use client";

import { useEffect, useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { defaultQuery, fetchProducts } from "../lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "../lib/products";

// 4.1 นำสถานะ "idle" ออก เพราะเปิดหน้ามาจะเริ่มโหลดอัตโนมัติทันที
type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  // 4.1 ตั้งสถานะเริ่มต้นเป็น "loading"
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  // 4.2 State สำหรับเก็บสินค้าที่กำลังแก้ไข
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery = defaultQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // 4.1 ใช้ useEffect เพื่อโหลดข้อมูลอัตโนมัติครั้งแรกตอนเปิดหน้า
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []); // ใส่ Array ว่างเพื่อทำครั้งเดียวตอนแสดงผลครั้งแรก

  // 3.7 & 4.2 บันทึกข้อมูลสินค้า (เพิ่ม/แก้ไข)
  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      // โหมดแก้ไข: อัปเดตรายการเดิม
      setProducts(
        products.map((item) =>
          item.id === editingProduct.id
            ? { ...draft, id: editingProduct.id, thumbnail: editingProduct.thumbnail }
            : item
        )
      );
      setEditingProduct(null); // กลับสู่โหมดเพิ่ม
    } else {
      // โหมดเพิ่ม: ต่อท้าย Array ใหม่ด้วย Date.now() เป็น id
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  // 4.2 ลบสินค้าออกจากรายการ
  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    // หากกำลังแก้ไขรายการที่ถูกลบ ให้ยกเลิกโหมดแก้ไขด้วย
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">📦 รายการสินค้า</h1>
        {/* เปลี่ยนความหมายเป็นปุ่มโหลดซ้ำ */}
        <button
          type="button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all shadow-sm cursor-pointer"
        >
          {status === "loading" ? "⏳ กำลังโหลด..." : "🔄 โหลดข้อมูลซ้ำ"}
        </button>
      </div>

      {/* 2.5 ฟอร์มค้นหาสินค้า */}
      <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">🔍 ค้นหาสินค้า</h2>
       <ProductSearchForm onSearch={(query) => loadProducts(query)} />
      </section>

      {/* 3.2 & 4.2 ฟอร์มเพิ่ม/แก้ไขสินค้า */}
      <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          {editingProduct ? "✏️ แก้ไขสินค้า" : "➕ เพิ่มสินค้าใหม่"}
        </h2>
        <ProductForm
          key={editingProduct ? editingProduct.id : "new"} // เปลี่ยน key เพื่อ Reset Form เมื่อเปลี่ยนรายการแก้ไข
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </section>

      {/* ส่วนแสดงตารางรายการสินค้า */}
      <section aria-live="polite" className="min-h-[200px]">
        {status === "loading" && (
          <p className="text-blue-500 text-center py-12 animate-pulse font-medium">
            กำลังดึงข้อมูลสินค้าจาก DummyJSON...
          </p>
        )}

        {status === "error" && (
          <div role="alert" className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-center font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {status === "ready" && products.length === 0 && (
          <p className="text-gray-500 text-center py-12">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4 w-20">รูปภาพ</th>
                  <th className="p-4">ชื่อสินค้า</th>
                  <th className="p-4">ราคา ($)</th>
                  <th className="p-4">คงเหลือ</th>
                  <th className="p-4">หมวดหมู่</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-gray-50"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          ไม่มีรูป
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.title}</td>
                    <td className="p-4 text-emerald-600 font-semibold">${item.price}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.stock > 10 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {item.stock} ชิ้น
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="capitalize">{item.category}</span>
                    </td>
                    {/* 4.2 ปุ่มแก้ไขและลบ */}
                    <td className="p-4 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(item)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(item.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium transition-colors"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}