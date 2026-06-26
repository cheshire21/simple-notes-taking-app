"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import type { JSX } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import useCategories from "@/features/categories/hooks/useCategories";
import CategoryDropdown from "@/features/notes/components/CategoryDropdown";
import NoteEditor from "@/features/notes/components/NoteEditor";
import useCreateNote from "@/features/notes/hooks/useCreateNote";
import useDeleteNote from "@/features/notes/hooks/useDeleteNote";
import useUpdateNote from "@/features/notes/hooks/useUpdateNote";
import {
  createNoteSchema,
  type CreateNoteFormValues,
} from "@/features/notes/schemas/createNote.schema";
import type { Note } from "@/features/notes/types";
import { hexToRgba } from "@/lib/utils";

interface NoteModalProps {
  onClose: () => void;
  note?: Note;
  defaultCategoryId?: string;
}

const NoteModal = ({ onClose, note, defaultCategoryId }: NoteModalProps): JSX.Element => {
  const { data: categories = [] } = useCategories();
  const { mutate: createMutate, isPending: createPending } = useCreateNote();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateNote();
  const { mutate: deleteMutate, isPending: deletePending } = useDeleteNote();
  const isPending = note ? updatePending : createPending;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
      category_id: note?.category.id ?? defaultCategoryId ?? "",
    },
  });

  const categoryId = useWatch({ control, name: "category_id" });
  const selectedCategory = categories.find((cat) => cat.id === categoryId) ?? null;

  const handleError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.data) {
      const data = error.response.data as Record<string, string[]>;
      if (data.title) setError("title", { message: data.title[0] });
      if (data.category_id) setError("category_id", { message: data.category_id[0] });
    }
  };

  const onSubmit = (values: CreateNoteFormValues): void => {
    if (note) {
      updateMutate({ id: note.id, ...values }, { onSuccess: onClose, onError: handleError });
    } else {
      createMutate(values, { onSuccess: onClose, onError: handleError });
    }
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
        <p className="text-xs text-black text-right">
          {note
            ? `Last Edited: ${new Date(note.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${new Date(note.updated_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()}`
            : "Last Edited: Today"}
        </p>

        {/* Title */}
        <input
          {...register("title")}
          placeholder="Note Title"
          className="text-[24px] leading-none font-bold text-black bg-transparent outline-none placeholder:text-black"
          style={{ fontFamily: "var(--font-inria-serif)" }}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}

        {/* Content */}
        <Controller
          control={control}
          name="content"
          render={({ field }) => <NoteEditor value={field.value} onChange={field.onChange} />}
        />

        {/* Save button */}
        <div className="flex justify-between items-center">
          {note && (
            <Button
              type="button"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              disabled={deletePending}
              onClick={() => deleteMutate(note.id, { onSuccess: onClose })}
            >
              {deletePending ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Button
            type="submit"
            variant="outline"
            className="bg-transparent border-brown/40 text-black hover:bg-black/10"
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
