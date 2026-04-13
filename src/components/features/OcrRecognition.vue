<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">OCR 识别</h2>
      <p class="mt-1 text-muted-foreground">
        根据文件类型自动选择最佳识别引擎
      </p>
    </div>

    <!-- Settings -->
    <div class="rounded-lg border border-border bg-card">
      <div class="border-b border-border px-6 py-4">
        <h3 class="text-lg font-semibold">识别设置</h3>
        <p class="text-sm text-muted-foreground">配置 OCR 识别参数</p>
      </div>
      <div class="p-6">
        <div class="grid gap-4 md:grid-cols-3">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">OCR 引擎</label>
            <n-select v-model:value="ocrEngine" :options="engineOptions" placeholder="选择引擎" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">识别语言</label>
            <n-select v-model:value="ocrLang" :options="langOptions" placeholder="选择语言" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">输出格式</label>
            <n-select v-model:value="outputFormat" :options="formatOptions" placeholder="选择格式" />
          </div>
        </div>
      </div>
    </div>

    <!-- File List & Preview -->
    <div class="grid gap-6 lg:grid-cols-5">
      <!-- File List -->
      <div class="rounded-lg border border-border bg-card lg:col-span-2">
        <div class="border-b border-border px-6 py-4">
          <h3 class="text-lg font-semibold">待识别文件</h3>
          <p class="text-sm text-muted-foreground">
            {{ files.filter((f) => f.status === 'completed').length }}/{{ files.length }} 已完成
          </p>
        </div>
        <div class="p-4">
          <div class="space-y-2">
            <div
              v-for="file in files"
              :key="file.id"
              @click="selectedFile = file"
              :class="[
                'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                selectedFile?.id === file.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              ]"
            >
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <component
                  :is="getFileIcon(file.type)"
                  class="h-4 w-4 text-muted-foreground"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="truncate text-sm font-medium text-foreground">
                  {{ file.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ file.type.toUpperCase() }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <n-button
                  v-if="file.status === 'pending'"
                  size="small"
                  @click.stop="handleStartOcr(file.id)"
                >
                  <Play class="mr-1 h-3 w-3" />
                  识别
                </n-button>
                <n-tag v-if="file.status === 'processing'" type="warning">
                  <n-spin size="12" class="mr-1" />
                  处理中
                </n-tag>
                <n-tag v-if="file.status === 'completed'" type="success">
                  <CheckCircle2 class="mr-1 h-3 w-3" />
                  完成
                </n-tag>
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
                {{ selectedFile?.name || '选择文件查看' }}
              </h3>
              <p v-if="selectedFile?.confidence" class="text-sm text-muted-foreground">
                识别置信度: {{ selectedFile.confidence }}%
              </p>
            </div>
            <div v-if="selectedFile?.content" class="flex gap-2">
              <n-button size="small" @click="copyToClipboard(selectedFile.content || '')">
                <Copy class="mr-1 h-3 w-3" />
                复制
              </n-button>
              <n-button size="small">
                <Download class="mr-1 h-3 w-3" />
                导出
              </n-button>
            </div>
          </div>
        </div>
        <div class="p-6">
          <template v-if="selectedFile?.status === 'completed' && selectedFile.content">
            <n-tabs>
              <n-tab-pane name="preview" tab="预览">
                <div class="mt-4 rounded-lg bg-muted/50 p-4">
                  <pre class="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">{{ selectedFile.content }}</pre>
                </div>
              </n-tab-pane>
              <n-tab-pane name="raw" tab="原始文本">
                <div class="mt-4 rounded-lg border border-border bg-background p-4">
                  <code class="text-sm text-muted-foreground">{{ selectedFile.content }}</code>
                </div>
              </n-tab-pane>
            </n-tabs>
          </template>
          <div
            v-else-if="selectedFile?.status === 'processing'"
            class="flex min-h-[300px] flex-col items-center justify-center"
          >
            <n-spin size="large" />
            <p class="mt-4 text-muted-foreground">正在识别文档内容...</p>
          </div>
          <div
            v-else
            class="flex min-h-[300px] flex-col items-center justify-center text-muted-foreground"
          >
            <FileText class="h-12 w-12 opacity-50" />
            <p class="mt-4">选择文件并开始识别</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Play,
  CheckCircle2,
  Copy,
  Download,
} from 'lucide-vue-next'

interface RecognizedFile {
  id: string
  name: string
  type: string
  status: 'pending' | 'processing' | 'completed'
  content?: string
  confidence?: number
}

const mockFiles: RecognizedFile[] = [
  {
    id: '1',
    name: '合同文档.pdf',
    type: 'pdf',
    status: 'completed',
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
    id: '2',
    name: '数据报表.xlsx',
    type: 'xlsx',
    status: 'completed',
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
    id: '3',
    name: '技术文档.md',
    type: 'md',
    status: 'pending',
  },
]

const files = ref<RecognizedFile[]>(mockFiles)
const selectedFile = ref<RecognizedFile | null>(mockFiles[0])
const ocrEngine = ref('default')
const ocrLang = ref('zh')
const outputFormat = ref('text')

const engineOptions = [
  { label: '自动选择', value: 'default' },
  { label: 'Tesseract', value: 'tesseract' },
  { label: 'PaddleOCR', value: 'paddleocr' },
  { label: 'Azure AI Vision', value: 'azure' },
]

const langOptions = [
  { label: '中文简体', value: 'zh' },
  { label: '中文繁体', value: 'zh-tw' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
]

const formatOptions = [
  { label: '纯文本', value: 'text' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'JSON', value: 'json' },
  { label: 'HTML', value: 'html' },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText
    case 'xlsx':
    case 'xls':
      return FileSpreadsheet
    case 'md':
      return FileCode
    default:
      return FileText
  }
}

const handleStartOcr = (fileId: string) => {
  files.value = files.value.map((f) =>
    f.id === fileId ? { ...f, status: 'processing' } : f
  )

  setTimeout(() => {
    files.value = files.value.map((f) =>
      f.id === fileId
        ? {
            ...f,
            status: 'completed',
            content: '识别内容示例...\n\n这是通过OCR识别出的文本内容。',
            confidence: 96.8,
          }
        : f
    )
    if (selectedFile.value?.id === fileId) {
      selectedFile.value = files.value.find((f) => f.id === fileId) || null
    }
  }, 3000)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>
