import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OcrProcessResponse } from '@/api/ocr'

export interface OcrFileRecord {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  message?: string
  result?: OcrProcessResponse
  error?: string
}

export const useOcrStore = defineStore('ocr', () => {
  const files = ref<OcrFileRecord[]>([])

  function addFiles(newFiles: File[]) {
    const records: OcrFileRecord[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
    }))
    files.value = [...files.value, ...records]
    return records
  }

  function updateFile(id: string, updates: Partial<OcrFileRecord>) {
    files.value = files.value.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    )
  }

  function removeFile(id: string) {
    files.value = files.value.filter((f) => f.id !== id)
  }

  function clearFiles() {
    files.value = []
  }

  function getFileById(id: string) {
    return files.value.find((f) => f.id === id)
  }

  return {
    files,
    addFiles,
    updateFile,
    removeFile,
    clearFiles,
    getFileById,
  }
})
