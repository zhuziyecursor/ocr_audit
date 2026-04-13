"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react"

interface AuditRecord {
  id: string
  fileName: string
  fileType: string
  uploadTime: string
  processTime: string
  operator: string
  status: "completed" | "processing" | "failed" | "pending"
  accuracy: number
  issuesFound: number
  issuesResolved: number
}

const mockAuditData: AuditRecord[] = [
  {
    id: "1",
    fileName: "合同文档_v2.pdf",
    fileType: "pdf",
    uploadTime: "2024-01-15 10:30:22",
    processTime: "2.3s",
    operator: "张三",
    status: "completed",
    accuracy: 98.5,
    issuesFound: 5,
    issuesResolved: 4,
  },
  {
    id: "2",
    fileName: "财务报表_Q4.xlsx",
    fileType: "xlsx",
    uploadTime: "2024-01-15 09:15:00",
    processTime: "1.8s",
    operator: "李四",
    status: "completed",
    accuracy: 99.2,
    issuesFound: 2,
    issuesResolved: 2,
  },
  {
    id: "3",
    fileName: "技术文档.md",
    fileType: "md",
    uploadTime: "2024-01-15 08:45:30",
    processTime: "0.5s",
    operator: "王五",
    status: "completed",
    accuracy: 100,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: "4",
    fileName: "产品说明书.docx",
    fileType: "docx",
    uploadTime: "2024-01-14 16:20:15",
    processTime: "3.1s",
    operator: "张三",
    status: "processing",
    accuracy: 0,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: "5",
    fileName: "会议纪要.pdf",
    fileType: "pdf",
    uploadTime: "2024-01-14 14:00:00",
    processTime: "-",
    operator: "赵六",
    status: "failed",
    accuracy: 0,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: "6",
    fileName: "员工手册.pdf",
    fileType: "pdf",
    uploadTime: "2024-01-14 11:30:00",
    processTime: "4.2s",
    operator: "李四",
    status: "completed",
    accuracy: 97.8,
    issuesFound: 8,
    issuesResolved: 6,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-success text-success-foreground gap-1">
          <CheckCircle2 className="h-3 w-3" />
          已完成
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          处理中
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          失败
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          待处理
        </Badge>
      )
    default:
      return null
  }
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 99) return "text-success"
  if (accuracy >= 95) return "text-primary"
  if (accuracy >= 90) return "text-warning"
  return "text-destructive"
}

export function OcrAudit() {
  const [records] = useState<AuditRecord[]>(mockAuditData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: records.length,
    completed: records.filter((r) => r.status === "completed").length,
    processing: records.filter((r) => r.status === "processing").length,
    failed: records.filter((r) => r.status === "failed").length,
    avgAccuracy:
      records
        .filter((r) => r.status === "completed")
        .reduce((acc, r) => acc + r.accuracy, 0) /
        records.filter((r) => r.status === "completed").length || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">OCR 审计</h2>
        <p className="mt-1 text-muted-foreground">
          查看和管理所有 OCR 处理记录
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">总文件数</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">已完成</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.processing}</p>
                <p className="text-sm text-muted-foreground">处理中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.avgAccuracy.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">平均准确率</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索文件名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="failed">失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出报告
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">处理记录</CardTitle>
          <CardDescription>
            共 {filteredRecords.length} 条记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>文件名</TableHead>
                  <TableHead>上传时间</TableHead>
                  <TableHead>处理耗时</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>准确率</TableHead>
                  <TableHead>问题</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {record.fileName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {record.fileType.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">{record.uploadTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {record.processTime}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-sm">{record.operator}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.status === "completed" ? (
                        <span
                          className={`font-medium ${getAccuracyColor(
                            record.accuracy
                          )}`}
                        >
                          {record.accuracy}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.status === "completed" ? (
                        <div className="flex items-center gap-1">
                          {record.issuesFound > 0 ? (
                            <>
                              <AlertTriangle className="h-3 w-3 text-warning" />
                              <span className="text-sm">
                                {record.issuesResolved}/{record.issuesFound}
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              <span className="text-sm text-success">无问题</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            下载结果
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            删除记录
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              显示 1-{filteredRecords.length} 条，共 {filteredRecords.length} 条
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
