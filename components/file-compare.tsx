"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  ArrowLeftRight,
  FileText,
  Plus,
  Minus,
  Equal,
  RefreshCw,
  Download,
  ZoomIn,
  ZoomOut,
  GitCompare,
} from "lucide-react"

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified"
  lineNumber: { source?: number; target?: number }
  content: string
  oldContent?: string
}

const mockSourceContent = `甲方：北京科技有限公司
乙方：上海数据服务有限公司

合同编号：HT-2024-001

第一条 合作内容
甲乙双方经友好协商，就OCR文档识别服务达成以下协议：
1. 甲方委托乙方提供文档数字化处理服务
2. 乙方保证识别准确率不低于98%
3. 服务期限为2024年1月1日至2024年12月31日`

const mockTargetContent = `甲方：北京科技有限公司
乙方：上海数据服务有限公司

合同编号：HT-2024-002

第一条 合作内容
甲乙双方经友好协商，就OCR文档识别服务达成以下协议：
1. 甲方委托乙方提供文档数字化处理服务
2. 乙方保证识别准确率不低于99%
3. 服务期限为2024年1月1日至2025年6月30日
4. 新增条款：支持批量处理功能`

const mockDiffResult: DiffLine[] = [
  { type: "unchanged", lineNumber: { source: 1, target: 1 }, content: "甲方：北京科技有限公司" },
  { type: "unchanged", lineNumber: { source: 2, target: 2 }, content: "乙方：上海数据服务有限公司" },
  { type: "unchanged", lineNumber: { source: 3, target: 3 }, content: "" },
  { type: "modified", lineNumber: { source: 4, target: 4 }, content: "合同编号：HT-2024-002", oldContent: "合同编号：HT-2024-001" },
  { type: "unchanged", lineNumber: { source: 5, target: 5 }, content: "" },
  { type: "unchanged", lineNumber: { source: 6, target: 6 }, content: "第一条 合作内容" },
  { type: "unchanged", lineNumber: { source: 7, target: 7 }, content: "甲乙双方经友好协商，就OCR文档识别服务达成以下协议：" },
  { type: "unchanged", lineNumber: { source: 8, target: 8 }, content: "1. 甲方委托乙方提供文档数字化处理服务" },
  { type: "modified", lineNumber: { source: 9, target: 9 }, content: "2. 乙方保证识别准确率不低于99%", oldContent: "2. 乙方保证识别准确率不低于98%" },
  { type: "modified", lineNumber: { source: 10, target: 10 }, content: "3. 服务期限为2024年1月1日至2025年6月30日", oldContent: "3. 服务期限为2024年1月1日至2024年12月31日" },
  { type: "added", lineNumber: { target: 11 }, content: "4. 新增条款：支持批量处理功能" },
]

const mockFiles = [
  { id: "1", name: "合同文档_v1.pdf" },
  { id: "2", name: "合同文档_v2.pdf" },
  { id: "3", name: "数据报表.xlsx" },
  { id: "4", name: "技术文档.md" },
]

const getDiffLineClass = (type: DiffLine["type"]) => {
  switch (type) {
    case "added":
      return "bg-success/10 border-l-2 border-success"
    case "removed":
      return "bg-destructive/10 border-l-2 border-destructive"
    case "modified":
      return "bg-warning/10 border-l-2 border-warning"
    default:
      return ""
  }
}

export function FileCompare() {
  const [sourceFile, setSourceFile] = useState<string>("1")
  const [targetFile, setTargetFile] = useState<string>("2")
  const [diffResult, setDiffResult] = useState<DiffLine[]>(mockDiffResult)
  const [viewMode, setViewMode] = useState<"split" | "unified">("split")
  const [fontSize, setFontSize] = useState(14)

  const stats = {
    added: diffResult.filter((l) => l.type === "added").length,
    removed: diffResult.filter((l) => l.type === "removed").length,
    modified: diffResult.filter((l) => l.type === "modified").length,
    unchanged: diffResult.filter((l) => l.type === "unchanged").length,
  }

  const handleCompare = () => {
    setDiffResult(mockDiffResult)
  }

  const swapFiles = () => {
    const temp = sourceFile
    setSourceFile(targetFile)
    setTargetFile(temp)
  }

  const zoomIn = () => setFontSize((prev) => Math.min(prev + 2, 24))
  const zoomOut = () => setFontSize((prev) => Math.max(prev - 2, 10))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">文件对比</h2>
        <p className="mt-1 text-muted-foreground">
          对比源文件和目标文件的内容差异
        </p>
      </div>

      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">选择对比文件</CardTitle>
          <CardDescription>选择源文件和目标文件进行对比</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-foreground">
                源文件
              </label>
              <Select value={sourceFile} onValueChange={setSourceFile}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="选择源文件" />
                </SelectTrigger>
                <SelectContent>
                  {mockFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="shrink-0 mt-6 cursor-pointer"
              onClick={swapFiles}
              aria-label="交换文件"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium text-foreground">
                目标文件
              </label>
              <Select value={targetFile} onValueChange={setTargetFile}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="选择目标文件" />
                </SelectTrigger>
                <SelectContent>
                  {mockFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="mt-6 shrink-0 cursor-pointer" onClick={handleCompare}>
              <GitCompare className="mr-2 h-4 w-4" />
              开始对比
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Plus className="h-3.5 w-3.5 text-success" />
            <span>新增 {stats.added}</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Minus className="h-3.5 w-3.5 text-destructive" />
            <span>删除 {stats.removed}</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-warning" />
            <span>修改 {stats.modified}</span>
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Equal className="h-3.5 w-3.5 text-muted-foreground" />
            <span>相同 {stats.unchanged}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "split" | "unified")}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="split" className="cursor-pointer">分栏视图</TabsTrigger>
              <TabsTrigger value="unified" className="cursor-pointer">合并视图</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none cursor-pointer"
              onClick={zoomOut}
              aria-label="缩小"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs text-muted-foreground min-w-[40px] text-center">
              {fontSize}px
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none cursor-pointer"
              onClick={zoomIn}
              aria-label="放大"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Diff View */}
      <Card>
        <CardContent className="p-0">
          {viewMode === "split" ? (
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Source */}
              <div>
                <div className="sticky top-0 z-10 border-b border-border bg-muted/50 px-4 py-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    源文件: {mockFiles.find((f) => f.id === sourceFile)?.name}
                  </p>
                </div>
                <div className="max-h-[500px] overflow-auto">
                  {diffResult.map((line, idx) => (
                    <div
                      key={`source-${idx}`}
                      className={cn(
                        "flex font-mono transition-colors duration-150",
                        getDiffLineClass(line.type),
                        line.type === "removed" || line.type === "modified"
                          ? "bg-destructive/5"
                          : ""
                      )}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <span className="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none">
                        {line.lineNumber.source || ""}
                      </span>
                      <span className="flex-1 px-4 py-1.5">
                        {line.type === "modified"
                          ? line.oldContent
                          : line.type !== "added"
                          ? line.content
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div>
                <div className="sticky top-0 z-10 border-b border-border bg-muted/50 px-4 py-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    目标文件: {mockFiles.find((f) => f.id === targetFile)?.name}
                  </p>
                </div>
                <div className="max-h-[500px] overflow-auto">
                  {diffResult.map((line, idx) => (
                    <div
                      key={`target-${idx}`}
                      className={cn(
                        "flex font-mono transition-colors duration-150",
                        getDiffLineClass(line.type),
                        (line.type === "added" || line.type === "modified")
                          ? "bg-success/5"
                          : ""
                      )}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <span className="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none">
                        {line.lineNumber.target || ""}
                      </span>
                      <span className="flex-1 px-4 py-1.5">
                        {line.type !== "removed" ? line.content : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-auto">
              {diffResult.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex font-mono transition-colors duration-150",
                    getDiffLineClass(line.type)
                  )}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <span className="w-10 shrink-0 border-r border-border bg-muted/30 px-2 py-1.5 text-center text-muted-foreground select-none">
                    {line.type === "added" && <Plus className="h-3.5 w-3.5 text-success inline" />}
                    {line.type === "removed" && <Minus className="h-3.5 w-3.5 text-destructive inline" />}
                    {line.type === "modified" && <RefreshCw className="h-3.5 w-3.5 text-warning inline" />}
                  </span>
                  <span className="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none">
                    {line.lineNumber.source || "-"}
                  </span>
                  <span className="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1.5 text-right text-muted-foreground select-none">
                    {line.lineNumber.target || "-"}
                  </span>
                  <span className="flex-1 px-4 py-1.5">{line.content}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
