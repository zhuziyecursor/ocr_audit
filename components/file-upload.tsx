"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  X,
  CheckCircle2,
  Loader2,
  FileUp,
  FileCheck,
} from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "success" | "error"
  progress: number
}

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText
  if (type.includes("word") || type.includes("document")) return FileText
  if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet
  if (type.includes("markdown") || type.includes("text")) return FileCode
  return File
}

const getFileTypeBadge = (type: string, name: string) => {
  const ext = name.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return { label: "PDF", variant: "default" as const }
  if (ext === "doc" || ext === "docx") return { label: "Word", variant: "secondary" as const }
  if (ext === "xls" || ext === "xlsx") return { label: "Excel", variant: "secondary" as const }
  if (ext === "md") return { label: "Markdown", variant: "secondary" as const }
  return { label: ext?.toUpperCase() || "FILE", variant: "outline" as const }
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === uploadedFile.id) {
              const newProgress = Math.min(f.progress + 10, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "success" : "uploading",
              }
            }
            return f
          })
        )
      }, 200)

      setTimeout(() => clearInterval(interval), 2200)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
  })

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const completedCount = files.filter((f) => f.status === "success").length
  const totalCount = files.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">文件上传</h2>
          <p className="mt-1 text-muted-foreground">
            上传需要进行 OCR 识别的文档文件
          </p>
        </div>
        {totalCount > 0 && (
          <Badge variant="outline" className="px-3 py-1.5 text-sm">
            {completedCount}/{totalCount} 已完成
          </Badge>
        )}
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed overflow-hidden">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={cn(
              "group flex min-h-[300px] cursor-pointer flex-col items-center justify-center p-8 transition-all duration-300",
              isDragActive
                ? "bg-primary/5"
                : "hover:bg-muted/20"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300",
                isDragActive
                  ? "bg-primary/15 scale-110 shadow-lg shadow-primary/20"
                  : "bg-muted group-hover:bg-muted/80"
              )}
            >
              {isDragActive ? (
                <FileCheck className="h-10 w-10 text-primary" />
              ) : (
                <FileUp className={cn(
                  "h-10 w-10 transition-colors duration-300",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </div>
            <h3 className="mt-5 text-xl font-semibold text-foreground tracking-tight">
              {isDragActive ? "释放文件以上传" : "拖放文件到此处"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              或点击选择文件，支持 PDF、Word、Excel、Markdown 等格式
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["PDF", "Word", "Excel", "Markdown", "TXT"].map((format) => (
                <Badge key={format} variant="secondary" className="px-3 py-1 font-medium">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">已上传文件</CardTitle>
                <CardDescription>
                  共 {totalCount} 个文件，等待处理
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                清空列表
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((uploadedFile, index) => {
              const Icon = getFileIcon(uploadedFile.file.type)
              const typeBadge = getFileTypeBadge(
                uploadedFile.file.type,
                uploadedFile.file.name
              )
              return (
                <div
                  key={uploadedFile.id}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
                    uploadedFile.status === "success"
                      ? "bg-success/10"
                      : uploadedFile.status === "uploading"
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-6 w-6",
                      uploadedFile.status === "success"
                        ? "text-success"
                        : uploadedFile.status === "uploading"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {uploadedFile.file.name}
                      </p>
                      <Badge variant={typeBadge.variant} className="shrink-0 text-xs">
                        {typeBadge.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                      {uploadedFile.status === "uploading" && (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <Progress value={uploadedFile.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-10 text-right">
                            {uploadedFile.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === "uploading" && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                    {uploadedFile.status === "success" && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      onClick={() => removeFile(uploadedFile.id)}
                      aria-label="移除文件"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="px-6 cursor-pointer">
            清空列表
          </Button>
          <Button className="px-6 cursor-pointer shadow-lg shadow-primary/20">
            <Upload className="mr-2 h-4 w-4" />
            开始 OCR 识别
          </Button>
        </div>
      )}
    </div>
  )
}
