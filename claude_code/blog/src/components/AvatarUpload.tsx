"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName?: string;
  className?: string;
}

export function AvatarUpload({ currentAvatar, userName, className }: AvatarUploadProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("文件大小不能超过 4MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        await fetch("/api/user/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: url }),
        });
        toast.success("头像上传成功");
        router.refresh();
      } else {
        toast.error("上传失败");
      }
    } catch {
      toast.error("上传失败");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-border transition-colors relative">
        {currentAvatar ? (
          <img src={currentAvatar} alt={userName || "头像"} className="w-full h-full object-cover" />
        ) : (
          <User className="h-10 w-10 text-muted-foreground" />
        )}
        
        {(isHovered || uploading) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-white" />
            )}
          </div>
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        disabled={uploading}
      />
    </div>
  );
}
