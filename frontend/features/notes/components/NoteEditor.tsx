"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { List, ListOrdered } from "lucide-react";
import type { JSX } from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const NoteEditor = ({
  value,
  onChange,
  placeholder = "Pour your heart out...",
}: NoteEditorProps): JSX.Element => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-full text-black text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const isEmpty = !editor || editor.isEmpty;

  return (
    <div className="relative flex-1 overflow-y-auto">
      {isEmpty && (
        <span className="absolute top-0 left-0 text-base text-black pointer-events-none select-none">
          {placeholder}
        </span>
      )}
      {editor && (
        <FloatingMenu editor={editor} options={{ placement: "left", offset: { mainAxis: 8 } }}>
          <div className="flex items-center gap-0.5 bg-cream/90 backdrop-blur-sm border border-brown/20 rounded-lg shadow-sm px-1 py-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-black/10" : ""}
            >
              <List size={13} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Numbered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-black/10" : ""}
            >
              <ListOrdered size={13} />
            </Button>
          </div>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
};

export default NoteEditor;
