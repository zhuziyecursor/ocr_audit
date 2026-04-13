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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Play,
  Loader2,
  CheckCircle2,
  Copy,
  Download,
  FileSearch,
} from "lucide-react"

interface RecognizedFile {
  id: string
  name: string
  type: string
  status: "pending" | "processing" | "completed"
  content?: string
  confidence?: number
}

const mockFiles: RecognizedFile[] = [
  {
    id: "1",
    name: "合同文档.pdf",
    type: "pdf",
    status: "completed",
    content: `甲方：北京科技有限公司
乙方：上海数据服务有限公司

合同编号：HT-2024-001

第一条 合作内容
甲乙双方经友好协商，就OCR文档识别服务达成以下协议：
1. 甲方委托乙方提供文档数字化处理服务
2. 乙方保证识别准确率不低于98%
3. 服务期限为2024年1月1日至2024年12月31日

第二条 费用及支付
1. 服务费用总计：人民币 ¥150,000.00 元整
2. 支付方式：按季度支付，每季度支付37,500元`,
    confidence: 98.5,
  },
  {
    id: "2",
    name: "数据报表.xlsx",
    type: "xlsx",
    status: "completed",
    content: `| 月份 | 销售额 | 增长率 |
|------|--------|--------|
| 1月  | 125,000 | 12.5% |
| 2月  | 138,500 | 10.8% |
| 3月  | 156,200 | 12.8% |
| 4月  | 142,800 | -8.6% |
| 5月  | 168,900 | 18.3% |`,
    confidence: 97.2,
  },
  {
    id: "3",
    name: "技术文档.md",
    type: "md",
    status: "pending",
  },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return FileText
    case "xlsx":
    case "xls":
      return FileSpreadsheet
    case "md":
      return FileCode
    default:
      return FileText
  }
}

export function OcrRecognition() {
  const [files, setFiles] = useState<RecognizedFile[]>(mockFiles)
  const [selectedFile, setSelectedFile] = useState<RecognizedFile | null>(mockFiles[0])
  const [ocrEngine, setOcrEngine] = useState("default")

  const handleStartOcr = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f))
    )

    // Simulate OCR processing
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "completed",
                content: "识别内容示例...\n\n这是通过OCR识别出的文本内容。",
                confidence: 96.8,
              }
            : f
        )
      )
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const completedCount = files.filter((f) => f.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">OCR 识别</h2>
        <p className="mt-1 text-muted-foreground">
          根据文件类型自动选择最佳识别引擎
        </p>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">识别设置</CardTitle>
          <CardDescription>配置 OCR 识别参数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                OCR 引擎
              </label>
              <Select value={ocrEngine} onValueChange={setOcrEngine}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="选择引擎" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">自动选择</SelectItem>
                  <SelectItem value="tesseract">Tesseract</SelectItem>
                  <SelectItem value="paddleocr">PaddleOCR</SelectItem>
                  <SelectItem value="azure">Azure AI Vision</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                识别语言
              </label>
              <Select defaultValue="zh">
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="选择语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文简体</SelectItem>
                  <SelectItem value="zh-tw">中文繁体</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                输出格式
              </label>
              <Select defaultValue="text">
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">纯文本</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List & Preview */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* File List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">待识别文件</CardTitle>
                <CardDescription>
                  {completedCount}/{files.length} 已完成
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => {
                const Icon = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
                      selectedFile?.id === file.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:bg-muted/30 hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors duration-200 group-hover:bg-muted/80">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.type.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartOcr(file.id)
                          }}
                          className="cursor-pointer"
                        >
                          <Play className="mr-1 h-3 w-3" />
                          识别
                        </Button>
                      )}
                      {file.status === "processing" && (
                        <Badge variant="secondary" className="gap-1">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          处理中
                        </Badge>
                      )}
                      {file.status === "completed" && (
                        <Badge className="bg-success text-success-foreground gap-1">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          完成
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedFile?.name || "选择文件查看"}
                </CardTitle>
                {selectedFile?.confidence && (
                  <CardDescription>
                    识别置信度: {selectedFile.confidence}%
                  </CardDescription>
                )}
              </div>
              {selectedFile?.content && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedFile.content || "")}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    复制
                  </Button>
                  <Button size="sm" variant="outline" className="cursor-pointer">
                    <Download className="mr-1 h-3 w-3" />
                    导出
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedFile?.status === "completed" && selectedFile.content ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="cursor-pointer">预览</TabsTrigger>
                  <TabsTrigger value="raw" className="cursor-pointer">原始文本</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div className="rounded-lg bg-muted/30 p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {selectedFile.content}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <code className="text-sm text-muted-foreground">
                      {selectedFile.content}
                    </code>
                  </div>
                </TabsContent>
              </Tabs>
            ) : selectedFile?.status === "processing" ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <p className="text-muted-foreground">正在识别文档内容...</p>
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-muted-foreground">
                <FileSearch className="h-12 w-12 opacity-50" />
                <p>选择文件并开始识别</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
