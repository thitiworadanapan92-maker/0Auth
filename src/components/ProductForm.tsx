"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "../lib/products";
import type { Product, ProductDraft } from "../lib/products";
type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : { title: "", price: undefined, stock: undefined, category: "" as any },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(saveProduct)} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อสินค้า
        </label>
        <input
          id="title"
          required
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span id="title-error" role="alert" className="text-xs text-red-500 mt-1 block">
          {errors.title?.message}
        </span>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          ราคา ($)
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          required
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span id="price-error" role="alert" className="text-xs text-red-500 mt-1 block">
          {errors.price?.message}
        </span>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          จำนวนคงเหลือ
        </label>
        <input
          id="stock"
          type="number"
          required
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          aria-describedby="stock-error"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span id="stock-error" role="alert" className="text-xs text-red-500 mt-1 block">
          {errors.stock?.message}
        </span>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          หมวดหมู่
        </label>
        <select
          id="category"
          required
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
        >
          <option value="">กรุณาเลือกหมวดหมู่</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span id="category-error" role="alert" className="text-xs text-red-500 mt-1 block">
          {errors.category?.message}
        </span>
      </div>

      <div className="md:col-span-2 flex gap-2 pt-2">
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-md font-medium text-sm transition-colors cursor-pointer"
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium text-sm transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}