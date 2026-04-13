<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">内容校对</h2>
      <p class="mt-1 text-muted-foreground">
        审核并修正 OCR 识别中可能存在的问题
      </p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-4">
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <AlertTriangle class="h-5 w-5 text-warning" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ issues.length }}</p>
            <p class="text-sm text-muted-foreground">总问题数</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText class="h-5 w-5 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ pendingIssues.length }}</p>
            <p class="text-sm text-muted-foreground">待处理</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <CheckCircle2 class="h-5 w-5 text-success" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ acceptedIssues.length }}</p>
            <p class="text-sm text-muted-foreground">已采纳</p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <XCircle class="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ rejectedIssues.length }}</p>
            <p class="text-sm text-muted-foreground">已忽略</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid gap-6 lg:grid-cols-5">
      <!-- Issue List -->
      <div class="rounded-lg border border-border bg-card lg:col-span-2">
        <div class="border-b border-border px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">问题列表</h3>
              <p class="text-sm text-muted-foreground">点击查看详情</p>
            </div>
            <n-select v-model:value="selectedFile" :options="fileOptions" size="small" class="w-40" />
          </div>
        </div>
        <div class="max-h-[450px] overflow-auto p-4">
          <div class="space-y-2">
            <div
              v-for="issue in issues"
              :key="issue.id"
              @click="selectIssue(issue)"
              :class="[
                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                selectedIssue?.id === issue.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50',
                issue.status === 'accepted' && 'opacity-60',
                issue.status === 'rejected' && 'opacity-40'
              ]"
            >
              <div class="mt-0.5">
                <component :is="getIssueIcon(issue.type)" class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <n-tag v-if="issue.type === 'error'" type="error" size="small">错误</n-tag>
                  <n-tag v-else-if="issue.type === 'warning'" type="warning" size="small">警告</n-tag>
                  <n-tag v-else type="info" size="small">建议</n-tag>
                  <span class="text-xs text-muted-foreground">
                    置信度 {{ issue.confidence }}%
                  </span>
                </div>
                <p class="mt-1 text-sm text-foreground line-clamp-2">
                  <span class="line-through text-destructive">{{ issue.original }}</span>
                  {{ ' → ' }}
                  <span class="text-success">{{ issue.suggestion }}</span>
                </p>
                <p class="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {{ issue.context }}
                </p>
              </div>
              <n-tag v-if="issue.status !== 'pending'" :type="issue.status === 'accepted' ? 'success' : 'default'" size="small">
                {{ issue.status === 'accepted' ? '已采纳' : '已忽略' }}
              </n-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Editor & Preview -->
      <div class="rounded-lg border border-border bg-card lg:col-span-3">
        <div class="border-b border-border px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">问题详情</h3>
              <p v-if="selectedIssue" class="text-sm text-muted-foreground">
                第 {{ currentIndex + 1 }} / {{ pendingIssues.length }} 个待处理问题
              </p>
            </div>
            <div class="flex items-center gap-2">
              <n-button quaternary circle size="small" @click="goToPrev" :disabled="currentIndex === 0">
                <ChevronLeft class="h-4 w-4" />
              </n-button>
              <n-button quaternary circle size="small" @click="goToNext" :disabled="currentIndex >= pendingIssues.length - 1">
                <ChevronRight class="h-4 w-4" />
              </n-button>
            </div>
          </div>
        </div>
        <div class="p-6">
          <template v-if="selectedIssue">
            <!-- Issue Info -->
            <div class="rounded-lg border border-border bg-muted/30 p-4">
              <div class="mb-3 flex items-center gap-2">
                <component :is="getIssueIcon(selectedIssue.type)" class="h-4 w-4" />
                <n-tag v-if="selectedIssue.type === 'error'" type="error" size="small">错误</n-tag>
                <n-tag v-else-if="selectedIssue.type === 'warning'" type="warning" size="small">警告</n-tag>
                <n-tag v-else type="info" size="small">建议</n-tag>
                <span class="text-sm text-muted-foreground">
                  置信度: {{ selectedIssue.confidence }}%
                </span>
              </div>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label class="text-xs font-medium text-muted-foreground">原始内容</label>
                  <n-input :value="selectedIssue.original" readonly />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-muted-foreground">建议修改为</label>
                  <n-input :value="selectedIssue.suggestion" />
                </div>
              </div>
            </div>

            <!-- Context Preview -->
            <div class="mt-4 space-y-2">
              <label class="text-sm font-medium text-foreground">上下文预览</label>
              <div class="rounded-lg border border-border bg-muted/20 p-4">
                <p class="text-sm text-foreground leading-relaxed">...{{ selectedIssue.context }}...</p>
              </div>
            </div>

            <!-- Full Content -->
            <div class="mt-4 space-y-2">
              <label class="text-sm font-medium text-foreground">文档内容</label>
              <n-input v-model:value="content" type="textarea" :autosize="{ minRows: 6, maxRows: 10 }" />
            </div>

            <!-- Actions -->
            <div v-if="selectedIssue.status === 'pending'" class="mt-4 flex justify-end gap-3 pt-2">
              <n-button @click="handleReject(selectedIssue.id)">
                <XCircle class="mr-2 h-4 w-4" />
                忽略
              </n-button>
              <n-button type="primary" @click="handleAccept(selectedIssue.id)">
                <CheckCircle2 class="mr-2 h-4 w-4" />
                采纳修改
              </n-button>
            </div>
          </template>
          <div v-else class="flex min-h-[400px] flex-col items-center justify-center text-muted-foreground">
            <CheckCircle2 class="h-12 w-12 text-success opacity-50" />
            <p class="mt-4">所有问题已处理完毕</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex justify-end gap-3">
      <n-button>
        <RotateCcw class="mr-2 h-4 w-4" />
        重置所有
      </n-button>
      <n-button type="primary">
        <Save class="mr-2 h-4 w-4" />
        保存修改
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
} from 'lucide-vue-next'

interface IssueItem {
  id: string
  type: 'error' | 'warning' | 'suggestion'
  original: string
  suggestion: string
  context: string
  position: { start: number; end: number }
  status: 'pending' | 'accepted' | 'rejected'
  confidence: number
}

const mockIssues: IssueItem[] = [
  {
    id: '1',
    type: 'error',
    original: '98%',
    suggestion: '98.5%',
    context: '乙方保证识别准确率不低于98%',
    position: { start: 156, end: 159 },
    status: 'pending',
    confidence: 85,
  },
  {
    id: '2',
    type: 'warning',
    original: '2024年12月31日',
    suggestion: '2024年12月31日（含）',
    context: '服务期限为2024年1月1日至2024年12月31日',
    position: { start: 210, end: 224 },
    status: 'pending',
    confidence: 72,
  },
  {
    id: '3',
    type: 'suggestion',
    original: '人民币',
    suggestion: '人民币（RMB）',
    context: '服务费用总计：人民币 ¥150,000.00 元整',
    position: { start: 280, end: 283 },
    status: 'pending',
    confidence: 60,
  },
  {
    id: '4',
    type: 'error',
    original: '37,500元',
    suggestion: '37,500.00元',
    context: '每季度支付37,500元',
    position: { start: 320, end: 329 },
    status: 'accepted',
    confidence: 92,
  },
  {
    id: '5',
    type: 'warning',
    original: '友好协商',
    suggestion: '友好协商一致',
    context: '甲乙双方经友好协商',
    position: { start: 89, end: 93 },
    status: 'rejected',
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

const issues = ref<IssueItem[]>(mockIssues)
const selectedIssue = ref<IssueItem | null>(mockIssues[0])
const currentIndex = ref(0)
const content = ref(mockContent)
const selectedFile = ref('1')

const pendingIssues = computed(() => issues.value.filter((i) => i.status === 'pending'))
const acceptedIssues = computed(() => issues.value.filter((i) => i.status === 'accepted'))
const rejectedIssues = computed(() => issues.value.filter((i) => i.status === 'rejected'))

const fileOptions = [
  { label: '合同文档.pdf', value: '1' },
  { label: '数据报表.xlsx', value: '2' },
]

const getIssueIcon = (type: string) => {
  switch (type) {
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'suggestion':
      return MessageSquare
    default:
      return null
  }
}

const selectIssue = (issue: IssueItem) => {
  selectedIssue.value = issue
  currentIndex.value = pendingIssues.value.indexOf(issue)
}

const handleAccept = (id: string) => {
  issues.value = issues.value.map((i) => (i.id === id ? { ...i, status: 'accepted' } : i))
  goToNext()
}

const handleReject = (id: string) => {
  issues.value = issues.value.map((i) => (i.id === id ? { ...i, status: 'rejected' } : i))
  goToNext()
}

const goToNext = () => {
  const next = Math.min(currentIndex.value + 1, pendingIssues.value.length - 1)
  currentIndex.value = next
  selectedIssue.value = pendingIssues.value[next] || null
}

const goToPrev = () => {
  const prev = Math.max(currentIndex.value - 1, 0)
  currentIndex.value = prev
  selectedIssue.value = pendingIssues.value[prev] || null
}
</script>
