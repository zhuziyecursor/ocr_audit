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
          accept=".pdf,.doc,.docx,.xls,.xlsx,.md,.txt"
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
          <n-tag type="default">Word</n-tag>
          <n-tag type="default">Excel</n-tag>
          <n-tag type="default">Markdown</n-tag>
        </div>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="rounded-lg border border-border bg-card p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-foreground">已上传文件</h3>
        <p class="text-sm text-muted-foreground">
          共 {{ files.length }} 个文件，
          {{ files.filter((f) => f.status === 'success').length }} 个已完成
        </p>
      </div>
      <div class="space-y-3">
        <div
          v-for="uploadedFile in files"
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
            <div v-if="uploadedFile.status === 'uploading'" class="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full bg-primary transition-all duration-300"
                :style="{ width: `${uploadedFile.progress}%` }"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <n-spin v-if="uploadedFile.status === 'uploading'" :size="20" />
            <n-icon v-if="uploadedFile.status === 'success'" size="20" color="#10b981">
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
    <div v-if="files.length > 0" class="flex justify-end gap-3">
      <n-button @click="clearFiles">清空列表</n-button>
      <n-button type="primary">开始 OCR 识别</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  X,
  CheckCircle2,
} from 'lucide-vue-next'

interface UploadedFile {
  id: string
  file: File
  status: 'uploading' | 'success' | 'error'
  progress: number
}

const files = ref<UploadedFile[]>([])
const isDragActive = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText
  if (type.includes('word') || type.includes('document')) return FileText
  if (type.includes('sheet') || type.includes('excel')) return FileSpreadsheet
  if (type.includes('markdown') || type.includes('text')) return FileCode
  return File
}

const getFileTypeBadge = (_type: string, name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return { label: 'PDF', variant: 'default' as const }
  if (ext === 'doc' || ext === 'docx') return { label: 'Word', variant: 'secondary' as const }
  if (ext === 'xls' || ext === 'xlsx') return { label: 'Excel', variant: 'secondary' as const }
  if (ext === 'md') return { label: 'Markdown', variant: 'secondary' as const }
  return { label: ext?.toUpperCase() || 'FILE', variant: 'outline' as const }
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragActive.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const uploads: UploadedFile[] = newFiles.map((file) => ({
    id: Math.random().toString(36).substr(2, 9),
    file,
    status: 'uploading',
    progress: 0,
  }))

  files.value = [...files.value, ...uploads]

  uploads.forEach((uploadedFile) => {
    const interval = setInterval(() => {
      files.value = files.value.map((f) => {
        if (f.id === uploadedFile.id) {
          const newProgress = Math.min(f.progress + 10, 100)
          return {
            ...f,
            progress: newProgress,
            status: newProgress === 100 ? 'success' : 'uploading',
          }
        }
        return f
      })
    }, 200)

    setTimeout(() => clearInterval(interval), 2200)
  })
}

const removeFile = (id: string) => {
  files.value = files.value.filter((f) => f.id !== id)
}

const clearFiles = () => {
  files.value = []
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
