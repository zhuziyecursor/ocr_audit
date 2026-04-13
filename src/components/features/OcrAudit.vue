<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">OCR 审计</h2>
      <p class="mt-1 text-muted-foreground">
        查看和管理所有 OCR 处理记录
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.total }}</p>
            <p class="text-sm text-muted-foreground">总文件数</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <CheckCircle2 class="h-5 w-5 text-success" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.completed }}</p>
            <p class="text-sm text-muted-foreground">已完成</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <Clock class="h-5 w-5 text-warning" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.processing }}</p>
            <p class="text-sm text-muted-foreground">处理中</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.avgAccuracy.toFixed(1) }}%</p>
            <p class="text-sm text-muted-foreground">平均准确率</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="rounded-lg border border-border bg-card">
      <div class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 items-center gap-4">
          <n-input
            v-model:value="searchQuery"
            placeholder="搜索文件名..."
            class="max-w-xs"
          >
            <template #prefix>
              <Search class="h-4 w-4 text-muted-foreground" />
            </template>
          </n-input>
          <n-select
            v-model:value="statusFilter"
            :options="statusOptions"
            placeholder="状态"
            class="w-32"
          />
        </div>
        <n-button>
          <Download class="mr-2 h-4 w-4" />
          导出报告
        </n-button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-lg border border-border bg-card">
      <div class="border-b border-border px-6 py-4">
        <h3 class="text-lg font-semibold">处理记录</h3>
        <p class="text-sm text-muted-foreground">
          共 {{ filteredRecords.length }} 条记录
        </p>
      </div>
      <div class="overflow-hidden">
        <n-data-table
          :columns="columns"
          :data="filteredRecords"
          :pagination="false"
          :bordered="false"
        />
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between border-t border-border p-4">
        <p class="text-sm text-muted-foreground">
          显示 1-{{ filteredRecords.length }} 条，共 {{ filteredRecords.length }} 条
        </p>
        <div class="flex items-center gap-2">
          <n-button size="small" disabled>上一页</n-button>
          <n-button size="small" disabled>下一页</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  AlertTriangle,
  Calendar,
  User,
} from 'lucide-vue-next'
import type { DataTableColumns } from 'naive-ui'
import { NDropdown, NButton } from 'naive-ui'

interface AuditRecord {
  id: string
  fileName: string
  fileType: string
  uploadTime: string
  processTime: string
  operator: string
  status: 'completed' | 'processing' | 'failed' | 'pending'
  accuracy: number
  issuesFound: number
  issuesResolved: number
}

const mockAuditData: AuditRecord[] = [
  {
    id: '1',
    fileName: '合同文档_v2.pdf',
    fileType: 'pdf',
    uploadTime: '2024-01-15 10:30:22',
    processTime: '2.3s',
    operator: '张三',
    status: 'completed',
    accuracy: 98.5,
    issuesFound: 5,
    issuesResolved: 4,
  },
  {
    id: '2',
    fileName: '财务报表_Q4.xlsx',
    fileType: 'xlsx',
    uploadTime: '2024-01-15 09:15:00',
    processTime: '1.8s',
    operator: '李四',
    status: 'completed',
    accuracy: 99.2,
    issuesFound: 2,
    issuesResolved: 2,
  },
  {
    id: '3',
    fileName: '技术文档.md',
    fileType: 'md',
    uploadTime: '2024-01-15 08:45:30',
    processTime: '0.5s',
    operator: '王五',
    status: 'completed',
    accuracy: 100,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: '4',
    fileName: '产品说明书.docx',
    fileType: 'docx',
    uploadTime: '2024-01-14 16:20:15',
    processTime: '3.1s',
    operator: '张三',
    status: 'processing',
    accuracy: 0,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: '5',
    fileName: '会议纪要.pdf',
    fileType: 'pdf',
    uploadTime: '2024-01-14 14:00:00',
    processTime: '-',
    operator: '赵六',
    status: 'failed',
    accuracy: 0,
    issuesFound: 0,
    issuesResolved: 0,
  },
  {
    id: '6',
    fileName: '员工手册.pdf',
    fileType: 'pdf',
    uploadTime: '2024-01-14 11:30:00',
    processTime: '4.2s',
    operator: '李四',
    status: 'completed',
    accuracy: 97.8,
    issuesFound: 8,
    issuesResolved: 6,
  },
]

const records = ref<AuditRecord[]>(mockAuditData)
const searchQuery = ref('')
const statusFilter = ref('all')

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '处理中', value: 'processing' },
  { label: '失败', value: 'failed' },
]

const filteredRecords = computed(() => {
  return records.value.filter((record) => {
    const matchesSearch = record.fileName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || record.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => ({
  total: records.value.length,
  completed: records.value.filter((r) => r.status === 'completed').length,
  processing: records.value.filter((r) => r.status === 'processing').length,
  failed: records.value.filter((r) => r.status === 'failed').length,
  avgAccuracy:
    records.value.filter((r) => r.status === 'completed').reduce((acc, r) => acc + r.accuracy, 0) /
      records.value.filter((r) => r.status === 'completed').length || 0,
}))

const getStatusTag = (status: string) => {
  switch (status) {
    case 'completed':
      return h('div', { class: 'flex items-center gap-1' }, [
        h(CheckCircle2, { class: 'h-3 w-3 text-success' }),
        '已完成'
      ])
    case 'processing':
      return h('div', { class: 'flex items-center gap-1' }, [
        h(Clock, { class: 'h-3 w-3 text-warning' }),
        '处理中'
      ])
    case 'failed':
      return h('div', { class: 'flex items-center gap-1' }, [
        h(XCircle, { class: 'h-3 w-3 text-destructive' }),
        '失败'
      ])
    case 'pending':
      return h('div', { class: 'flex items-center gap-1' }, [
        h(Clock, { class: 'h-3 w-3 text-muted-foreground' }),
        '待处理'
      ])
    default:
      return null
  }
}

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 99) return 'text-success'
  if (accuracy >= 95) return 'text-primary'
  if (accuracy >= 90) return 'text-warning'
  return 'text-destructive'
}

const columns: DataTableColumns<AuditRecord> = [
  {
    title: '文件名',
    key: 'fileName',
    render(row) {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(FileText, { class: 'h-4 w-4 text-muted-foreground' }),
        h('span', { class: 'font-medium text-foreground' }, row.fileName),
        h('span', { class: 'text-xs text-muted-foreground border border-border rounded px-1' }, row.fileType.toUpperCase())
      ])
    }
  },
  {
    title: '上传时间',
    key: 'uploadTime',
    render(row) {
      return h('div', { class: 'flex items-center gap-1 text-muted-foreground' }, [
        h(Calendar, { class: 'h-3 w-3' }),
        h('span', { class: 'text-sm' }, row.uploadTime)
      ])
    }
  },
  {
    title: '处理耗时',
    key: 'processTime',
    render(row) {
      return h('span', { class: 'text-sm text-muted-foreground' }, row.processTime)
    }
  },
  {
    title: '操作人',
    key: 'operator',
    render(row) {
      return h('div', { class: 'flex items-center gap-1 text-muted-foreground' }, [
        h(User, { class: 'h-3 w-3' }),
        h('span', { class: 'text-sm' }, row.operator)
      ])
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return getStatusTag(row.status)
    }
  },
  {
    title: '准确率',
    key: 'accuracy',
    render(row) {
      if (row.status === 'completed') {
        return h('span', { class: `font-medium ${getAccuracyColor(row.accuracy)}` }, `${row.accuracy}%`)
      }
      return h('span', { class: 'text-muted-foreground' }, '-')
    }
  },
  {
    title: '问题',
    key: 'issues',
    render(row) {
      if (row.status === 'completed') {
        if (row.issuesFound > 0) {
          return h('div', { class: 'flex items-center gap-1' }, [
            h(AlertTriangle, { class: 'h-3 w-3 text-warning' }),
            h('span', { class: 'text-sm' }, `${row.issuesResolved}/${row.issuesFound}`)
          ])
        }
        return h('div', { class: 'flex items-center gap-1' }, [
          h(CheckCircle2, { class: 'h-3 w-3 text-success' }),
          h('span', { class: 'text-sm text-success' }, '无问题')
        ])
      }
      return h('span', { class: 'text-muted-foreground' }, '-')
    }
  },
  {
    title: '',
    key: 'actions',
    width: 50,
    render(row) {
      return h(NDropdown, {
        trigger: 'click',
        options: [
          { label: '查看详情', key: 'view', icon: () => h(Eye, { class: 'h-4 w-4 mr-2' }) },
          { label: '下载结果', key: 'download', icon: () => h(Download, { class: 'h-4 w-4 mr-2' }) },
          { type: 'divider' },
          { label: '删除记录', key: 'delete', icon: () => h(XCircle, { class: 'h-4 w-4 mr-2' }) }
        ],
        onSelect: (key: string) => handleAction(key, row)
      }, () => h(NButton, { quaternary: true, circle: true, size: 'small' }, () => h(MoreHorizontal, { class: 'h-4 w-4' })))
    }
  }
]

const handleAction = (key: string, row: AuditRecord) => {
  console.log(key, row)
}
</script>
