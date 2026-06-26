"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import type { JSX } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import CategoryDropdown from "@/components/ui/CategoryDropdown";
import useCategories from "@/features/categories/hooks/useCategories";
import useCreateNote from "@/features/notes/hooks/useCreateNote";
import {
  createNoteSchema,
  type CreateNoteFormValues,
} from "@/features/notes/schemas/createNote.schema";

const hexToRgba = (hex: string, alpha: number): string => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

interface NoteModalProps {
  onClose: () => void;
}

const NoteModal = ({ onClose }: NoteModalProps): JSX.Element => {
  const { data: categories = [] } = useCategories();
  const { mutate, isPending } = useCreateNote();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: "", content: "", category_id: "" },
  });

  const categoryId = useWatch({ control, name: "category_id" });
  const selectedCategory = categories.find((cat) => cat.id === categoryId) ?? null;

  const onSubmit = (values: CreateNoteFormValues): void => {
    mutate(values, {
      onSuccess: onClose,
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data) {
          const data = error.response.data as Record<string, string[]>;
          if (data.title) setError("title", { message: data.title[0] });
          if (data.category_id) setError("category_id", { message: data.category_id[0] });
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream p-6 gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Category dropdown */}
        <div className="flex flex-col gap-1">
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <CategoryDropdown
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={(cat) => field.onChange(cat.id)}
              />
            )}
          />
          {errors.category_id && (
            <p className="text-xs text-red-500 pl-1">{errors.category_id.message}</p>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-brown/60 hover:text-brown"
        >
          <X size={24} />
        </button>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col px-16 py-9 gap-4 overflow-hidden"
        style={{
          borderRadius: "11px",
          backgroundColor: hexToRgba(selectedCategory?.color ?? "#e8d5c4", 0.5),
          border: `3px solid ${selectedCategory?.color ?? "#e8d5c4"}`,
        }}
      >
        {/* Last edited */}
        <p className="text-xs text-black/50 text-right">Last edited: Today</p>

        {/* Title */}
        <input
          {...register("title")}
          placeholder="Note Title"
          className="text-[24px] leading-none font-bold text-black bg-transparent outline-none placeholder:text-black/40"
          style={{ fontFamily: "var(--font-inria-serif)" }}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}

        {/* Content */}
        <textarea
          {...register("content")}
          placeholder="Pour your heart out..."
          className="flex-1 resize-none text-base text-black bg-transparent outline-none placeholder:text-black/50"
        />

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outline"
            className="rounded-full bg-transparent border-brown/40 text-black hover:bg-black/10"
            disabled={isPending}
          >
            {isPending ? "Saving…" : "Save Note"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NoteModal;
