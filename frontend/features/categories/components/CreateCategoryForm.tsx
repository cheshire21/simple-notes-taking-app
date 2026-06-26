"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Check, X } from "lucide-react";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
        <div className="relative shrink-0 w-2.5 h-2.5">
          <span
            className="block w-2.5 h-2.5 rounded-full"
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
          className="flex-1 text-xs text-black bg-transparent border-b border-brown/40 outline-none px-0.5 py-0.5 placeholder:text-black min-w-0"
        />
        <input type="hidden" {...register("color")} />

        <Button
          type="submit"
          size="icon-xs"
          disabled={isPending}
          aria-label="Add category"
          className="bg-brown text-cream hover:opacity-80 border-0"
        >
          <Check size={8} strokeWidth={3} />
        </Button>

        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={onCancel}
          aria-label="Cancel"
          className="text-brown/50 hover:text-brown hover:bg-transparent"
        >
          <X size={8} strokeWidth={2.5} />
        </Button>
      </div>
      {errors.name && <p className="text-xs text-red-500 pl-7">{errors.name.message}</p>}
    </form>
  );
};

export default CreateCategoryForm;
