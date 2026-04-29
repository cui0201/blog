"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtons = [
  { label: "B", title: "粗体", prefix: "**", suffix: "**" },
  { label: "I", title: "斜体", prefix: "_", suffix: "_" },
  { label: "~~", title: "删除线", prefix: "~~", suffix: "~~" },
  { label: "H1", title: "标题1", prefix: "# ", suffix: "" },
  { label: "H2", title: "标题2", prefix: "## ", suffix: "" },
  { label: "🔗", title: "链接", prefix: "[", suffix: "](url)" },
  { label: "```", title: "代码块", prefix: "```\n", suffix: "\n```" },
  { label: "`", title: "行内代码", prefix: "`", suffix: "`" },
  { label: "•", title: "列表", prefix: "- ", suffix: "" },
  { label: "1.", title: "有序列表", prefix: "1. ", suffix: "" },
  { label: "> ", title: "引用", prefix: "> ", suffix: "" },
  { label: "---", title: "分隔线", prefix: "---\n", suffix: "" },
];

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [splitView, setSplitView] = useState(true);

  const insertMarkdown = useCallback((prefix: string, suffix: string) => {
    const textarea = document.querySelector("textarea[data-md-editor]") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }, [value, onChange]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    toast.success("已复制到剪贴板");
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => insertMarkdown(btn.prefix, btn.suffix)}
              title={btn.title}
              className="px-2 py-1 text-sm font-mono bg-secondary text-secondary-foreground rounded hover:bg-accent transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            title="复制内容"
            className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            复制
          </button>
          <button
            type="button"
            onClick={() => setSplitView(!splitView)}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              splitView ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            {splitView ? "预览" : "编辑"}
          </button>
        </div>
      </div>

      <div className={cn(
        "grid gap-4",
        splitView ? "grid-cols-2" : "grid-cols-1"
      )}>
        <textarea
          data-md-editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] md:min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
        />
        {splitView && (
          <div className="min-h-[300px] md:min-h-[400px] p-4 rounded-md border border-border bg-card overflow-auto">
            {value ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">预览区域</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
