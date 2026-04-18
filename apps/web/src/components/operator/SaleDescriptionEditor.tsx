"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

type Props = {
  saleId: string;
  initialHtml: string;
  placeholder?: string;
  onChange: (html: string) => void;
  className?: string;
};

/**
 * Rich text description (TipTap). Stored as HTML in `sales.description`.
 */
export function SaleDescriptionEditor({
  saleId,
  initialHtml,
  placeholder = "Highlights, payment types, what’s for sale, house rules…",
  onChange,
  className,
}: Props) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
        }),
        Placeholder.configure({ placeholder }),
      ],
      editorProps: {
        attributes: {
          class: cn(
            "min-h-[220px] w-full max-w-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "dark:bg-input/30",
            "[&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:font-medium",
            "[&_p]:my-1.5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
          ),
        },
      },
      content: initialHtml || "",
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
    },
    [saleId],
  );

  if (!editor) {
    return (
      <div
        className={cn(
          "min-h-[220px] animate-pulse rounded-lg border border-border bg-muted/40",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1 dark:bg-zinc-900/50">
        <EditorToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <EditorToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <EditorToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <EditorToolbarButton
          label="List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
        active
          ? "bg-accent text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
