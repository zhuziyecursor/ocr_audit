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
  FileSearch,
  ChevronLeft,
  ChevronRight,
  Activity,
  Files,
  BarChart3,
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
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 gap-1.5 hover:bg-blue-500/15">
          <CheckCircle2 className="h-3 w-3" />
          已完成
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1.5">
          <Clock className="h-3 w-3 animate-spin" />
          处理中
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1.5">
          <XCircle className="h-3 w-3" />
          失败
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3 w-3" />
          待处理
        </Badge>
      )
    default:
      return null
  }
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 99) return "text-green-600 font-semibold"
  if (accuracy >= 95) return "text-blue-600 font-medium"
  if (accuracy >= 90) return "text-yellow-600 font-medium"
  return "text-red-500"
}

export function OcrAudit() {
  const [records] = useState<AuditRecord[]>(mockAuditData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRecords.length / pageSize)
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">OCR 审计</h2>
          <p className="mt-1 text-muted-foreground">
            查看和管理所有 OCR 处理记录
          </p>
        </div>
        <Button className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white shadow-md">
          <Download className="mr-2 h-4 w-4" />
          导出报告
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-blue-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                  <Files className="h-7 w-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">总文件数</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-green-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">已完成</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-yellow-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 border border-yellow-100">
                  <Activity className="h-7 w-7 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.processing}</p>
                  <p className="text-sm text-muted-foreground">处理中</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-blue-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                  <BarChart3 className="h-7 w-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.avgAccuracy.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">平均准确率</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索文件名..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 h-10 cursor-text border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-40 h-10 cursor-pointer border-gray-200 focus:border-blue-400">
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
            <div className="text-sm text-muted-foreground">
              共找到 <span className="font-semibold text-foreground">{filteredRecords.length}</span> 条记录
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-gray-200">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">处理记录</CardTitle>
              <CardDescription>
                点击操作列查看更多操作
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-600">文件名</TableHead>
                      <TableHead className="font-semibold text-gray-600">上传时间</TableHead>
                      <TableHead className="font-semibold text-gray-600">处理耗时</TableHead>
                      <TableHead className="font-semibold text-gray-600">操作人</TableHead>
                      <TableHead className="font-semibold text-gray-600">状态</TableHead>
                      <TableHead className="font-semibold text-gray-600">准确率</TableHead>
                      <TableHead className="font-semibold text-gray-600">问题</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => (
                      <TableRow key={record.id} className="table-row-hover">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                              <FileText className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                {record.fileName}
                              </span>
                              <Badge variant="outline" className="ml-2 text-[10px] border-gray-200">
                                {record.fileType.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-sm">{record.uploadTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground font-mono">
                            {record.processTime}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span className="text-sm">{record.operator}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.status === "completed" ? (
                            <span className={getAccuracyColor(record.accuracy)}>
                              {record.accuracy}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.status === "completed" ? (
                            <div className="flex items-center gap-2">
                              {record.issuesFound > 0 ? (
                                <>
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm">
                                    {record.issuesResolved}/{record.issuesFound}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-600">无问题</span>
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Download className="mr-2 h-4 w-4" />
                                下载结果
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500 cursor-pointer">
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
              <div className="flex items-center justify-between px-5 py-4 border-t bg-gray-50/50">
                <p className="text-sm text-muted-foreground">
                  显示 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRecords.length)} 条，
                  共 {filteredRecords.length} 条
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer border-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer border-gray-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FileSearch className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">未找到匹配记录</p>
              <p className="text-sm">请尝试调整搜索条件</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
