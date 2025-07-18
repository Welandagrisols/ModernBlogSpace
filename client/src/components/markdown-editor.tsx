import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Code, Link, Image, List, Heading } from "lucide-react";
import MarkdownRenderer from "./markdown-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  preview?: boolean;
}

export default function MarkdownEditor({ value, onChange, preview = false }: MarkdownEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea[data-markdown-editor]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), title: "Italic" },
    { icon: Code, action: () => insertText("`", "`"), title: "Code" },
    { icon: Link, action: () => insertText("[", "](url)"), title: "Link" },
    { icon: Image, action: () => insertText("![", "](url)"), title: "Image" },
    { icon: Heading, action: () => insertText("## ", ""), title: "Heading" },
    { icon: List, action: () => insertText("- ", ""), title: "List" },
  ];

  if (preview) {
    return (
      <div className="min-h-[400px] p-4 border border-border rounded-lg bg-background">
        <MarkdownRenderer content={value} />
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted border-b border-border p-3 flex items-center space-x-2">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        data-markdown-editor
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your post content in Markdown...

# This is a heading

This is a paragraph with **bold text** and *italic text*.

## Subheading

- List item 1
- List item 2
- List item 3

```javascript
// Code block
console.log('Hello, World!');
```"
        className="min-h-[400px] border-0 focus:ring-0 font-mono text-sm resize-none rounded-none"
        onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
      />
    </div>
  );
}
