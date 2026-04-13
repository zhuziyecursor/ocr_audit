<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">文件对比</h2>
      <p class="mt-1 text-muted-foreground">
        对比源文件和目标文件的内容差异
      </p>
    </div>

    <!-- File Selection -->
    <div class="rounded-lg border border-border bg-card">
      <div class="border-b border-border px-6 py-4">
        <h3 class="text-lg font-semibold">选择对比文件</h3>
        <p class="text-sm text-muted-foreground">选择源文件和目标文件进行对比</p>
      </div>
      <div class="p-6">
        <div class="flex flex-col items-center gap-4 md:flex-row">
          <div class="flex-1 space-y-2 w-full">
            <label class="text-sm font-medium text-foreground">源文件</label>
            <n-select v-model:value="sourceFile" :options="fileOptions" placeholder="选择源文件" />
          </div>

          <n-button quaternary circle @click="swapFiles" class="shrink-0 mt-6">
            <ArrowLeftRight class="h-4 w-4" />
          </n-button>

          <div class="flex-1 space-y-2 w-full">
            <label class="text-sm font-medium text-foreground">目标文件</label>
            <n-select v-model:value="targetFile" :options="fileOptions" placeholder="选择目标文件" />
          </div>

          <n-button type="primary" class="mt-6 shrink-0" @click="handleCompare">
            <RefreshCw class="mr-2 h-4 w-4" />
            开始对比
          </n-button>
        </div>
      </div>
    </div>

    <!-- Stats & Controls -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap gap-3">
        <n-tag type="success" round>
          <Plus class="h-3 w-3 mr-1" />
          新增 {{ stats.added }}
        </n-tag>
        <n-tag type="error" round>
          <Minus class="h-3 w-3 mr-1" />
          删除 {{ stats.removed }}
        </n-tag>
        <n-tag type="warning" round>
          <RefreshCw class="h-3 w-3 mr-1" />
          修改 {{ stats.modified }}
        </n-tag>
        <n-tag type="default" round>
          <Equal class="h-3 w-3 mr-1" />
          相同 {{ stats.unchanged }}
        </n-tag>
      </div>

      <div class="flex items-center gap-2">
        <n-tabs v-model:value="viewMode" @update:value="(v: string) => viewMode = v as 'split' | 'unified'">
          <n-tab-pane name="split" tab="分栏视图" />
          <n-tab-pane name="unified" tab="合并视图" />
        </n-tabs>
        <n-button quaternary circle><ZoomIn class="h-4 w-4" /></n-button>
        <n-button quaternary circle><ZoomOut class="h-4 w-4" /></n-button>
        <n-button size="small">
          <Download class="mr-2 h-4 w-4" />
          导出报告
        </n-button>
      </div>
    </div>

    <!-- Diff View -->
    <div class="rounded-lg border border-border bg-card">
      <div v-if="viewMode === 'split'" class="grid grid-cols-2 divide-x divide-border">
        <!-- Source -->
        <div>
          <div class="border-b border-border bg-muted/50 px-4 py-2">
            <p class="text-sm font-medium text-muted-foreground">
              源文件: {{ mockFiles.find((f) => f.id === sourceFile)?.name }}
            </p>
          </div>
          <div class="max-h-[500px] overflow-auto">
            <div
              v-for="(line, idx) in diffResult"
              :key="`source-${idx}`"
              :class="[
                'flex font-mono text-sm',
                line.type === 'removed' && 'bg-destructive/10',
                line.type === 'modified' && 'bg-warning/10'
              ]"
            >
              <span class="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1 text-right text-muted-foreground">
                {{ line.lineNumber.source || '' }}
              </span>
              <span class="flex-1 px-4 py-1">
                {{ line.type === 'modified' ? line.oldContent : line.type !== 'added' ? line.content : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Target -->
        <div>
          <div class="border-b border-border bg-muted/50 px-4 py-2">
            <p class="text-sm font-medium text-muted-foreground">
              目标文件: {{ mockFiles.find((f) => f.id === targetFile)?.name }}
            </p>
          </div>
          <div class="max-h-[500px] overflow-auto">
            <div
              v-for="(line, idx) in diffResult"
              :key="`target-${idx}`"
              :class="[
                'flex font-mono text-sm',
                line.type === 'added' && 'bg-success/10',
                line.type === 'modified' && 'bg-success/10'
              ]"
            >
              <span class="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1 text-right text-muted-foreground">
                {{ line.lineNumber.target || '' }}
              </span>
              <span class="flex-1 px-4 py-1">
                {{ line.type !== 'removed' ? line.content : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unified View -->
      <div v-else class="max-h-[500px] overflow-auto">
        <div
          v-for="(line, idx) in diffResult"
          :key="idx"
          :class="[
            'flex font-mono text-sm',
            line.type === 'added' && 'bg-success/10',
            line.type === 'removed' && 'bg-destructive/10',
            line.type === 'modified' && 'bg-warning/10'
          ]"
        >
          <span class="w-8 shrink-0 border-r border-border bg-muted/30 px-2 py-1 text-center text-muted-foreground">
            <Plus v-if="line.type === 'added'" class="h-3 w-3 text-success" />
            <Minus v-else-if="line.type === 'removed'" class="h-3 w-3 text-destructive" />
            <RefreshCw v-else-if="line.type === 'modified'" class="h-3 w-3 text-warning" />
          </span>
          <span class="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1 text-right text-muted-foreground">
            {{ line.lineNumber.source || '-' }}
          </span>
          <span class="w-12 shrink-0 border-r border-border bg-muted/30 px-2 py-1 text-right text-muted-foreground">
            {{ line.lineNumber.target || '-' }}
          </span>
          <span class="flex-1 px-4 py-1">{{ line.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
} from 'lucide-vue-next'

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified'
  lineNumber: { source?: number; target?: number }
  content: string
  oldContent?: string
}

const mockDiffResult: DiffLine[] = [
  { type: 'unchanged', lineNumber: { source: 1, target: 1 }, content: '甲方：北京科技有限公司' },
  { type: 'unchanged', lineNumber: { source: 2, target: 2 }, content: '乙方：上海数据服务有限公司' },
  { type: 'unchanged', lineNumber: { source: 3, target: 3 }, content: '' },
  { type: 'modified', lineNumber: { source: 4, target: 4 }, content: '合同编号：HT-2024-002', oldContent: '合同编号：HT-2024-001' },
  { type: 'unchanged', lineNumber: { source: 5, target: 5 }, content: '' },
  { type: 'unchanged', lineNumber: { source: 6, target: 6 }, content: '第一条 合作内容' },
  { type: 'unchanged', lineNumber: { source: 7, target: 7 }, content: '甲乙双方经友好协商，就OCR文档识别服务达成以下协议：' },
  { type: 'unchanged', lineNumber: { source: 8, target: 8 }, content: '1. 甲方委托乙方提供文档数字化处理服务' },
  { type: 'modified', lineNumber: { source: 9, target: 9 }, content: '2. 乙方保证识别准确率不低于99%', oldContent: '2. 乙方保证识别准确率不低于98%' },
  { type: 'modified', lineNumber: { source: 10, target: 10 }, content: '3. 服务期限为2024年1月1日至2025年6月30日', oldContent: '3. 服务期限为2024年1月1日至2024年12月31日' },
  { type: 'added', lineNumber: { target: 11 }, content: '4. 新增条款：支持批量处理功能' },
]

const mockFiles = [
  { id: '1', name: '合同文档_v1.pdf' },
  { id: '2', name: '合同文档_v2.pdf' },
  { id: '3', name: '数据报表.xlsx' },
  { id: '4', name: '技术文档.md' },
]

const sourceFile = ref('1')
const targetFile = ref('2')
const diffResult = ref<DiffLine[]>(mockDiffResult)
const viewMode = ref<'split' | 'unified'>('split')

const fileOptions = mockFiles.map((f) => ({
  label: () => h('div', { class: 'flex items-center gap-2' }, [
    h(FileText, { class: 'h-4 w-4' }),
    f.name
  ]),
  value: f.id,
}))

import { h } from 'vue'

const stats = computed(() => ({
  added: diffResult.value.filter((l) => l.type === 'added').length,
  removed: diffResult.value.filter((l) => l.type === 'removed').length,
  modified: diffResult.value.filter((l) => l.type === 'modified').length,
  unchanged: diffResult.value.filter((l) => l.type === 'unchanged').length,
}))

const handleCompare = () => {
  diffResult.value = mockDiffResult
}

const swapFiles = () => {
  const temp = sourceFile.value
  sourceFile.value = targetFile.value
  targetFile.value = temp
}
</script>
