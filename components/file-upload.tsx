"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  X,
  CheckCircle2,
  Loader2,
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">文件上传</h2>
        <p className="mt-1 text-muted-foreground">
          上传需要进行 OCR 识别的文档文件
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={cn(
              "flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-lg p-8 transition-colors",
              isDragActive
                ? "bg-primary/10 border-primary"
                : "hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {isDragActive ? "释放文件以上传" : "拖放文件到此处"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              或点击选择文件
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">PDF</Badge>
              <Badge variant="secondary">Word</Badge>
              <Badge variant="secondary">Excel</Badge>
              <Badge variant="secondary">Markdown</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">已上传文件</CardTitle>
            <CardDescription>
              共 {files.length} 个文件，
              {files.filter((f) => f.status === "success").length} 个已完成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((uploadedFile) => {
                const Icon = getFileIcon(uploadedFile.file.type)
                const typeBadge = getFileTypeBadge(
                  uploadedFile.file.type,
                  uploadedFile.file.name
                )
                return (
                  <div
                    key={uploadedFile.id}
                    className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {uploadedFile.file.name}
                        </p>
                        <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                      {uploadedFile.status === "uploading" && (
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "uploading" && (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}
                      {uploadedFile.status === "success" && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setFiles([])}>
            清空列表
          </Button>
          <Button>
            开始 OCR 识别
          </Button>
        </div>
      )}
    </div>
  )
}
