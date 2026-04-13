import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export interface OcrProcessParams {
  file: File
  fileType?: string
  language?: string
  extractTables?: boolean
  extractText?: boolean
  structuredOutput?: boolean
  tableMode?: 'auto' | 'pdfplumber-only' | 'existing-only' | 'mixed'
}

export interface OcrProcessResponse {
  status: 'success' | 'error'
  code: number
  message: string
  originalFilename?: string
  fileType?: string
  fileSize?: number
  processingTime?: number
  extractedText?: string
  data?: {
    text?: string
    tables?: unknown[]
    metadata?: Record<string, unknown>
    structuredInfo?: {
      title?: string
      author?: string
      creationDate?: string
      keyInfo?: Array<{ key: string; value: string; type: string }>
      summary?: string
      keywords?: string[]
      entities?: unknown
    }
  }
}

export interface OcrProgressEvent {
  progress: number
  status: 'uploading' | 'processing' | 'success' | 'error'
  message?: string
}

export async function processOcr(
  params: OcrProcessParams,
  onProgress?: (event: OcrProgressEvent) => void
): Promise<OcrProcessResponse> {
  const formData = new FormData()
  formData.append('file', params.file)

  if (params.fileType) {
    formData.append('fileType', params.fileType)
  }
  if (params.language) {
    formData.append('language', params.language)
  }
  if (params.extractTables !== undefined) {
    formData.append('extractTables', String(params.extractTables))
  }
  if (params.extractText !== undefined) {
    formData.append('extractText', String(params.extractText))
  }
  if (params.structuredOutput !== undefined) {
    formData.append('structuredOutput', String(params.structuredOutput))
  }
  if (params.tableMode) {
    formData.append('tableMode', params.tableMode)
  }

  onProgress?.({ progress: 0, status: 'uploading', message: '正在上传文件...' })

  try {
    const response = await axios.post<OcrProcessResponse>(
      `${API_BASE_URL}/api/ocr/v1/ocr/process`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress?.({ progress: Math.min(progress * 0.3, 30), status: 'uploading', message: '正在上传文件...' })
          }
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress?.({ progress: 30 + progress * 0.7, status: 'processing', message: '正在识别内容...' })
          }
        },
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'OCR处理失败'
      throw new Error(message)
    }
    throw error
  }
}
