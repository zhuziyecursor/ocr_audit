<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">OCR 识别</h2>
      <p class="mt-1 text-muted-foreground">
        查看文件 OCR 识别结果
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-if="ocrStore.files.length === 0"
      class="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card"
    >
      <FileText class="h-16 w-16 text-muted-foreground opacity-50" />
      <h3 class="mt-4 text-lg font-semibold text-foreground">暂无识别结果</h3>
      <p class="mt-2 text-sm text-muted-foreground">
        请先在文件上传页面上传文件并开始 OCR 识别
      </p>
      <n-button type="primary" class="mt-4" @click="$router.push('/upload')">
        前往上传
      </n-button>
    </div>

    <!-- File List & Preview -->
    <template v-else>
      <!-- Processing Summary -->
      <div class="rounded-lg border border-border bg-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-foreground">
              共 {{ ocrStore.files.length }} 个文件
            </p>
            <p class="text-xs text-muted-foreground">
              {{ completedCount }} 个已完成 · {{ errorCount }} 个失败 · {{ processingCount }} 个处理中
            </p>
          </div>
          <div class="flex items-center gap-2">
            <n-tag v-if="processingCount > 0" type="warning">
              <n-spin size="12" class="mr-1" />
              处理中
            </n-tag>
            <n-tag v-if="errorCount > 0" type="error">
              {{ errorCount }} 个失败
            </n-tag>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-5">
        <!-- File List -->
        <div class="rounded-lg border border-border bg-card lg:col-span-2">
          <div class="border-b border-border px-6 py-4">
            <h3 class="text-lg font-semibold">识别文件</h3>
            <p class="text-sm text-muted-foreground">
              {{ completedCount }}/{{ ocrStore.files.length }} 已完成
            </p>
          </div>
          <div class="p-4">
            <div class="space-y-2">
              <div
                v-for="file in ocrStore.files"
                :key="file.id"
                @click="selectedFileId = file.id"
                :class="[
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                  selectedFileId === file.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                ]"
              >
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <component
                    :is="getFileIcon(file.file.name)"
                    class="h-4 w-4 text-muted-foreground"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="truncate text-sm font-medium text-foreground">
                    {{ file.file.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ getFileExt(file.file.name).toUpperCase() }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <n-spin v-if="file.status === 'uploading' || file.status === 'processing'" :size="16" />
                  <n-tag v-if="file.status === 'pending'" type="default">待识别</n-tag>
                  <n-tag v-if="file.status === 'uploading'" type="info">上传中</n-tag>
                  <n-tag v-if="file.status === 'processing'" type="warning">识别中</n-tag>
                  <n-tag v-if="file.status === 'completed'" type="success">完成</n-tag>
                  <n-tag v-if="file.status === 'error'" type="error">失败</n-tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="rounded-lg border border-border bg-card lg:col-span-3">
          <div class="border-b border-border px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ currentFile?.file.name || '选择文件查看' }}
                </h3>
                <p v-if="currentFile?.result?.processingTime" class="text-sm text-muted-foreground">
                  处理耗时: {{ currentFile.result.processingTime }}ms
                </p>
              </div>
              <div v-if="extractedText" class="flex gap-2">
                <n-button size="small" @click="copyToClipboard(extractedText)">
                  <Copy class="mr-1 h-3 w-3" />
                  复制
                </n-button>
                <n-button size="small" @click="exportText">
                  <Download class="mr-1 h-3 w-3" />
                  导出
                </n-button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <!-- Error State -->
            <div
              v-if="currentFile?.status === 'error'"
              class="flex min-h-[300px] flex-col items-center justify-center text-red-500"
            >
              <AlertCircle class="h-12 w-12 opacity-50" />
              <p class="mt-4 font-medium">识别失败</p>
              <p class="mt-1 text-sm text-muted-foreground">{{ currentFile.error }}</p>
            </div>

            <!-- Processing State -->
            <div
              v-else-if="currentFile?.status === 'uploading' || currentFile?.status === 'processing'"
              class="flex min-h-[300px] flex-col items-center justify-center"
            >
              <n-spin size="large" />
              <p class="mt-4 text-muted-foreground">
                {{ currentFile?.message || '正在处理...' }}
              </p>
              <div v-if="currentFile?.progress" class="mt-4 w-48">
                <n-progress
                  type="line"
                  :percentage="currentFile.progress"
                  :show-indicator="true"
                />
              </div>
            </div>

            <!-- Completed - Show Content -->
            <template v-else-if="currentFile?.status === 'completed' && extractedText">
              <n-tabs>
                <n-tab-pane name="preview" tab="文本预览">
                  <div class="mt-4 rounded-lg bg-muted/50 p-4">
                    <pre class="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">{{ extractedText }}</pre>
                  </div>
                </n-tab-pane>
                <n-tab-pane name="tables" tab="表格数据" v-if="hasTables">
                  <div class="mt-4 space-y-4">
                    <div
                      v-for="(table, idx) in tables"
                      :key="idx"
                      class="overflow-auto rounded-lg border border-border"
                    >
                      <table class="w-full text-sm">
                        <tbody>
                          <tr
                            v-for="(row, rowIdx) in table"
                            :key="rowIdx"
                            :class="rowIdx === 0 ? 'bg-muted font-medium' : ''"
                          >
                            <td
                              v-for="(cell, cellIdx) in row"
                              :key="cellIdx"
                              class="border border-border px-3 py-2"
                            >
                              {{ cell }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </n-tab-pane>
                <n-tab-pane name="raw" tab="原始响应">
                  <div class="mt-4 rounded-lg border border-border bg-background p-4">
                    <pre class="overflow-auto text-xs text-muted-foreground">{{ JSON.stringify(currentFile.result, null, 2) }}</pre>
                  </div>
                </n-tab-pane>
              </n-tabs>
            </template>

            <!-- Pending State -->
            <div
              v-else-if="currentFile?.status === 'pending'"
              class="flex min-h-[300px] flex-col items-center justify-center text-muted-foreground"
            >
              <Clock class="h-12 w-12 opacity-50" />
              <p class="mt-4">文件待识别</p>
              <p class="mt-1 text-sm">请在文件上传页面开始 OCR 识别</p>
            </div>

            <!-- No file selected -->
            <div
              v-else
              class="flex min-h-[300px] flex-col items-center justify-center text-muted-foreground"
            >
              <FileText class="h-12 w-12 opacity-50" />
              <p class="mt-4">选择文件查看识别结果</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Copy,
  Download,
  AlertCircle,
  Clock,
} from 'lucide-vue-next'
import { useOcrStore } from '@/stores/ocr'

const ocrStore = useOcrStore()
const route = useRoute()

const selectedFileId = ref<string | null>(null)

// Auto-select file from URL query param on mount
onMounted(() => {
  const queryId = route.query.selected as string | undefined
  if (queryId && ocrStore.files.find((f) => f.id === queryId)) {
    selectedFileId.value = queryId
  } else if (!selectedFileId.value && ocrStore.files.length > 0) {
    // Fallback: auto-select first completed file or first file
    const firstCompleted = ocrStore.files.find((f) => f.status === 'completed')
    selectedFileId.value = firstCompleted?.id || ocrStore.files[0].id
  }
})

const currentFile = computed(() => {
  if (!selectedFileId.value) return null
  return ocrStore.files.find((f) => f.id === selectedFileId.value) || null
})

const completedCount = computed(
  () => ocrStore.files.filter((f) => f.status === 'completed').length
)
const errorCount = computed(
  () => ocrStore.files.filter((f) => f.status === 'error').length
)
const processingCount = computed(
  () => ocrStore.files.filter((f) => f.status === 'uploading' || f.status === 'processing').length
)

const extractedText = computed(() => {
  if (!currentFile.value?.result) return ''
  // Prefer extractedText top-level field, fall back to data.text
  return (
    currentFile.value.result.extractedText ||
    currentFile.value.result.data?.text ||
    ''
  )
})

const hasTables = computed(() => {
  const tables = currentFile.value?.result?.data?.tables
  return Array.isArray(tables) && tables.length > 0
})

const tables = computed(() => {
  const t = currentFile.value?.result?.data?.tables
  if (!Array.isArray(t)) return []
  return t as unknown[][]
})

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return FileText
  if (ext === 'xlsx' || ext === 'xls') return FileSpreadsheet
  if (ext === 'md') return FileCode
  return FileText
}

const getFileExt = (name: string) => {
  return name.split('.').pop() || ''
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  window.alert('已复制到剪贴板')
}

const exportText = () => {
  if (!extractedText.value || !currentFile.value) return
  const blob = new Blob([extractedText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentFile.value.file.name.replace(/\.[^.]+$/, '')}_ocr.txt`
  a.click()
  URL.revokeObjectURL(url)
  window.alert('导出成功')
}
</script>
