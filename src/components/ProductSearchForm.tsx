"use client";

import { useForm } from "react-hook-form";
import { defaultQuery } from "../lib/products";
import type { SearchQuery } from "../lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => void;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchQuery>({
    defaultValues: defaultQuery,
  });

  const onSubmit = (data: SearchQuery) => {
    onSearch(data);
  };

  const handleReset = () => {
    reset(defaultQuery);
    onSearch(defaultQuery);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-3 items-center">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="ค้นหาชื่อสินค้า..."
          {...register("q")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-32">
        <input
          type="number"
          placeholder="จำนวน"
          {...register("limit", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        ล้างคำค้นหา
      </button>
    </form>
  );
}