<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-foreground">文件上传</h2>
      <p class="mt-1 text-muted-foreground">
        上传需要进行 OCR 识别的文档文件
      </p>
    </div>

    <!-- Upload Zone -->
    <div class="rounded-lg border-2 border-dashed p-0">
      <div
        @click="triggerUpload"
        @dragover.prevent="isDragActive = true"
        @dragleave.prevent="isDragActive = false"
        @drop.prevent="handleDrop"
        :class="[
          'flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-lg p-8 transition-colors',
          isDragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
        ]"
      >
        <input
          ref="fileInputRef"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff,.tif,.gif,.docx,.xlsx,.txt"
          @change="handleFileSelect"
          class="hidden"
        />
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Upload class="h-8 w-8 text-primary" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-foreground">
          {{ isDragActive ? '释放文件以上传' : '拖放文件到此处' }}
        </h3>
        <p class="mt-2 text-sm text-muted-foreground">
          或点击选择文件
        </p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <n-tag type="default">PDF</n-tag>
          <n-tag type="default">PNG</n-tag>
          <n-tag type="default">JPG</n-tag>
          <n-tag type="default">Word</n-tag>
          <n-tag type="default">Excel</n-tag>
          <n-tag type="default">TXT</n-tag>
        </div>
      </div>
    </div>

    <!-- File List -->
    <div v-if="ocrStore.files.length > 0" class="rounded-lg border border-border bg-card p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-foreground">已上传文件</h3>
        <p class="text-sm text-muted-foreground">
          共 {{ ocrStore.files.length }} 个文件，
          {{ ocrStore.files.filter((f) => f.status === 'completed').length }} 个已完成
        </p>
      </div>
      <div class="space-y-3">
        <div
          v-for="uploadedFile in ocrStore.files"
          :key="uploadedFile.id"
          class="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <component :is="getFileIcon(uploadedFile.file.type)" class="h-5 w-5 text-muted-foreground" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-medium text-foreground">
                {{ uploadedFile.file.name }}
              </p>
              <n-tag :type="getFileTypeBadge(uploadedFile.file.type, uploadedFile.file.name).variant">
                {{ getFileTypeBadge(uploadedFile.file.type, uploadedFile.file.name).label }}
              </n-tag>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ formatFileSize(uploadedFile.file.size) }}
            </p>
            <div v-if="uploadedFile.status === 'uploading' || uploadedFile.status === 'processing'" class="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full bg-primary transition-all duration-300"
                :style="{ width: `${uploadedFile.progress}%` }"
              />
            </div>
            <p v-if="uploadedFile.message && (uploadedFile.status === 'uploading' || uploadedFile.status === 'processing')" class="mt-1 text-xs text-muted-foreground">
              {{ uploadedFile.message }}
            </p>
            <p v-if="uploadedFile.status === 'error'" class="mt-1 text-xs text-red-500">
              {{ uploadedFile.error }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <n-spin v-if="uploadedFile.status === 'uploading' || uploadedFile.status === 'processing'" :size="20" />
            <n-icon v-if="uploadedFile.status === 'completed'" size="20" color="#10b981">
              <CheckCircle2 />
            </n-icon>
            <n-button
              quaternary
              circle
              size="small"
              @click="removeFile(uploadedFile.id)"
            >
              <template #icon>
                <X class="h-4 w-4" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="ocrStore.files.length > 0" class="flex justify-end gap-3">
      <n-button @click="clearFiles" :disabled="isProcessing">清空列表</n-button>
      <n-button
        type="primary"
        @click="handleStartOcr"
        :disabled="isProcessing || ocrStore.files.length === 0"
        :loading="isProcessing"
      >
        {{ isProcessing ? '识别中...' : '开始 OCR 识别' }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  X,
  CheckCircle2,
} from 'lucide-vue-next'
import { processOcr } from '@/api/ocr'
import { useOcrStore } from '@/stores/ocr'

const router = useRouter()
const ocrStore = useOcrStore()

const isDragActive = ref(false)
const isProcessing = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText
  if (type.includes('word') || type.includes('document')) return FileText
  if (type.includes('sheet') || type.includes('excel')) return FileSpreadsheet
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('bmp') || type.includes('tiff') || type.includes('gif')) return FileText
  if (type.includes('text/plain') || type.includes('txt')) return FileCode
  return File
}

const getFileTypeBadge = (_type: string, name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return { label: 'PDF', variant: 'default' as const }
  if (ext === 'doc' || ext === 'docx') return { label: 'Word', variant: 'secondary' as const }
  if (ext === 'xls' || ext === 'xlsx') return { label: 'Excel', variant: 'secondary' as const }
  if (ext === 'png') return { label: 'PNG', variant: 'default' as const }
  if (ext === 'jpg' || ext === 'jpeg') return { label: 'JPG', variant: 'default' as const }
  if (ext === 'bmp') return { label: 'BMP', variant: 'default' as const }
  if (ext === 'tiff' || ext === 'tif') return { label: 'TIFF', variant: 'default' as const }
  if (ext === 'gif') return { label: 'GIF', variant: 'default' as const }
  if (ext === 'txt') return { label: 'TXT', variant: 'secondary' as const }
  return { label: ext?.toUpperCase() || 'FILE', variant: 'outline' as const }
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    ocrStore.addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragActive.value = false
  if (event.dataTransfer?.files) {
    ocrStore.addFiles(Array.from(event.dataTransfer.files))
  }
}

const removeFile = (id: string) => {
  ocrStore.removeFile(id)
}

const clearFiles = () => {
  ocrStore.clearFiles()
}

const handleStartOcr = async () => {
  isProcessing.value = true

  const pendingFiles = ocrStore.files.filter(
    (f) => f.status === 'pending' || f.status === 'error'
  )

  for (const fileRecord of pendingFiles) {
    ocrStore.updateFile(fileRecord.id, { status: 'uploading', progress: 0, message: '正在上传文件...' })

    try {
      const result = await processOcr(
        { file: fileRecord.file },
        (event) => {
          ocrStore.updateFile(fileRecord.id, {
            progress: event.progress,
            status: event.status === 'success' ? 'completed' : event.status as 'uploading' | 'processing' | 'completed' | 'error',
            message: event.message,
          })
        }
      )

      ocrStore.updateFile(fileRecord.id, {
        status: 'completed',
        progress: 100,
        message: '识别完成',
        result,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OCR处理失败'
      ocrStore.updateFile(fileRecord.id, {
        status: 'error',
        error: message,
      })
    }
  }

  isProcessing.value = false

  // Navigate to OCR results page and auto-select first completed file
  const firstCompleted = ocrStore.files.find((f) => f.status === 'completed')
  const targetId = firstCompleted?.id || ocrStore.files[0]?.id
  if (targetId) {
    router.push({ path: '/ocr', query: { selected: targetId } })
  } else {
    router.push('/ocr')
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
