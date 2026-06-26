"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Check, X } from "lucide-react";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "@/features/categories/schemas/createCategory.schema";

interface CreateCategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateCategoryForm = ({ onSuccess, onCancel }: CreateCategoryFormProps): JSX.Element => {
  const { mutate, isPending } = useCreateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { color: "#94a3b8" },
  });

  const selectedColor = watch("color");

  const onSubmit = (values: CreateCategoryFormValues): void => {
    mutate(values, {
      onSuccess,
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data?.name) {
          setError("name", { message: error.response.data.name[0] });
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 mt-1">
      <div className="flex items-center gap-1.5">
        <div className="relative shrink-0 w-3.5 h-3.5">
          <span
            className="block w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />
          <input
            type="color"
            value={selectedColor}
            onChange={(event) => setValue("color", event.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Pick color"
          />
        </div>

        <input
          {...register("name")}
          placeholder="Category name"
          disabled={isPending}
          onKeyDown={(event) => event.key === "Escape" && onCancel()}
          className="flex-1 text-sm text-brown bg-transparent border-b border-brown/40 outline-none px-0.5 py-0.5 placeholder:text-brown/40 min-w-0"
        />
        <input type="hidden" {...register("color")} />
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-brown/50 hover:text-brown transition-colors"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
        <button
          type="submit"
          disabled={isPending}
          aria-label="Add category"
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-brown text-cream hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          <Check size={11} strokeWidth={3} />
        </button>
      </div>
      {errors.name && <p className="text-xs text-red-500 pl-7">{errors.name.message}</p>}
    </form>
  );
};

export default CreateCategoryForm;
