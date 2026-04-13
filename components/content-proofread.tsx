"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  FileText,
} from "lucide-react"

interface IssueItem {
  id: string
  type: "error" | "warning" | "suggestion"
  original: string
  suggestion: string
  context: string
  position: { start: number; end: number }
  status: "pending" | "accepted" | "rejected"
  confidence: number
}

const mockIssues: IssueItem[] = [
  {
    id: "1",
    type: "error",
    original: "98%",
    suggestion: "98.5%",
    context: "乙方保证识别准确率不低于98%",
    position: { start: 156, end: 159 },
    status: "pending",
    confidence: 85,
  },
  {
    id: "2",
    type: "warning",
    original: "2024年12月31日",
    suggestion: "2024年12月31日（含）",
    context: "服务期限为2024年1月1日至2024年12月31日",
    position: { start: 210, end: 224 },
    status: "pending",
    confidence: 72,
  },
  {
    id: "3",
    type: "suggestion",
    original: "人民币",
    suggestion: "人民币（RMB）",
    context: "服务费用总计：人民币 ¥150,000.00 元整",
    position: { start: 280, end: 283 },
    status: "pending",
    confidence: 60,
  },
  {
    id: "4",
    type: "error",
    original: "37,500元",
    suggestion: "37,500.00元",
    context: "每季度支付37,500元",
    position: { start: 320, end: 329 },
    status: "accepted",
    confidence: 92,
  },
  {
    id: "5",
    type: "warning",
    original: "友好协商",
    suggestion: "友好协商一致",
    context: "甲乙双方经友好协商",
    position: { start: 89, end: 93 },
    status: "rejected",
    confidence: 45,
  },
]

const mockContent = `甲方：北京科技有限公司
乙方：上海数据服务有限公司

合同编号：HT-2024-001

第一条 合作内容
甲乙双方经友好协商，就OCR文档识别服务达成以下协议：
1. 甲方委托乙方提供文档数字化处理服务
2. 乙方保证识别准确率不低于98%
3. 服务期限为2024年1月1日至2024年12月31日

第二条 费用及支付
1. 服务费用总计：人民币 ¥150,000.00 元整
2. 支付方式：按季度支付，每季度支付37,500元`

const getIssueIcon = (type: string) => {
  switch (type) {
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />
    case "suggestion":
      return <MessageSquare className="h-4 w-4 text-primary" />
    default:
      return null
  }
}

const getIssueBadge = (type: string) => {
  switch (type) {
    case "error":
      return <Badge variant="destructive">错误</Badge>
    case "warning":
      return <Badge className="bg-warning text-warning-foreground">警告</Badge>
    case "suggestion":
      return <Badge variant="secondary">建议</Badge>
    default:
      return null
  }
}

export function ContentProofread() {
  const [issues, setIssues] = useState<IssueItem[]>(mockIssues)
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(mockIssues[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [content, setContent] = useState(mockContent)
  const [selectedFile, setSelectedFile] = useState("1")

  const pendingIssues = issues.filter((i) => i.status === "pending")
  const acceptedIssues = issues.filter((i) => i.status === "accepted")
  const rejectedIssues = issues.filter((i) => i.status === "rejected")

  const handleAccept = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "accepted" } : i))
    )
    goToNext()
  }

  const handleReject = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "rejected" } : i))
    )
    goToNext()
  }

  const goToNext = () => {
    const nextIndex = Math.min(currentIndex + 1, pendingIssues.length - 1)
    setCurrentIndex(nextIndex)
    setSelectedIssue(pendingIssues[nextIndex] || null)
  }

  const goToPrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0)
    setCurrentIndex(prevIndex)
    setSelectedIssue(pendingIssues[prevIndex] || null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">内容校对</h2>
        <p className="mt-1 text-muted-foreground">
          审核并修正 OCR 识别中可能存在的问题
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{issues.length}</p>
                <p className="text-sm text-muted-foreground">总问题数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingIssues.length}</p>
                <p className="text-sm text-muted-foreground">待处理</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{acceptedIssues.length}</p>
                <p className="text-sm text-muted-foreground">已采纳</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedIssues.length}</p>
                <p className="text-sm text-muted-foreground">已忽略</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Issue List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">问题列表</CardTitle>
                <CardDescription>点击查看详情</CardDescription>
              </div>
              <Select value={selectedFile} onValueChange={setSelectedFile}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="选择文件" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">合同文档.pdf</SelectItem>
                  <SelectItem value="2">数据报表.xlsx</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[450px] overflow-auto">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssue(issue)
                    setCurrentIndex(pendingIssues.indexOf(issue))
                  }}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    selectedIssue?.id === issue.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                    issue.status === "accepted" && "opacity-60",
                    issue.status === "rejected" && "opacity-40"
                  )}
                >
                  <div className="mt-0.5">{getIssueIcon(issue.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getIssueBadge(issue.type)}
                      <span className="text-xs text-muted-foreground">
                        置信度 {issue.confidence}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground line-clamp-2">
                      <span className="line-through text-destructive">{issue.original}</span>
                      {" → "}
                      <span className="text-success">{issue.suggestion}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {issue.context}
                    </p>
                  </div>
                  {issue.status !== "pending" && (
                    <Badge
                      variant={issue.status === "accepted" ? "default" : "outline"}
                      className={cn(
                        "shrink-0",
                        issue.status === "accepted" && "bg-success text-success-foreground"
                      )}
                    >
                      {issue.status === "accepted" ? "已采纳" : "已忽略"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Editor & Preview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">问题详情</CardTitle>
                {selectedIssue && (
                  <CardDescription>
                    第 {currentIndex + 1} / {pendingIssues.length} 个待处理问题
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  disabled={currentIndex >= pendingIssues.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedIssue ? (
              <div className="space-y-4">
                {/* Issue Info */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getIssueIcon(selectedIssue.type)}
                    {getIssueBadge(selectedIssue.type)}
                    <span className="text-sm text-muted-foreground">
                      置信度: {selectedIssue.confidence}%
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        原始内容
                      </label>
                      <Input
                        value={selectedIssue.original}
                        readOnly
                        className="bg-destructive/10 border-destructive/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        建议修改为
                      </label>
                      <Input
                        value={selectedIssue.suggestion}
                        className="bg-success/10 border-success/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Context Preview */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    上下文预览
                  </label>
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      ...{selectedIssue.context}...
                    </p>
                  </div>
                </div>

                {/* Full Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    文档内容
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                {/* Actions */}
                {selectedIssue.status === "pending" && (
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedIssue.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      忽略
                    </Button>
                    <Button onClick={() => handleAccept(selectedIssue.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      采纳修改
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 text-success opacity-50" />
                <p className="mt-4">所有问题已处理完毕</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          重置所有
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存修改
        </Button>
      </div>
    </div>
  )
}
