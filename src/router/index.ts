import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [
        { path: '', redirect: '/upload' },
        { path: 'upload', name: 'upload', component: () => import('@/components/features/FileUpload.vue') },
        { path: 'ocr', name: 'ocr', component: () => import('@/components/features/OcrRecognition.vue') },
        { path: 'compare', name: 'compare', component: () => import('@/components/features/FileCompare.vue') },
        { path: 'proofread', name: 'proofread', component: () => import('@/components/features/ContentProofread.vue') },
        { path: 'audit', name: 'audit', component: () => import('@/components/features/OcrAudit.vue') },
      ]
    }
  ]
})

export default router
