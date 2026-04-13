<template>
  <aside
    :class="[
      'flex flex-col border-r transition-all duration-300 h-screen',
      collapsed ? 'w-[72px]' : 'w-64'
    ]"
    :style="{
      backgroundColor: '#0F172A',
      borderColor: '#1E293B'
    }"
  >
    <!-- Logo -->
    <div
      class="flex h-16 items-center px-4"
      :style="{ borderBottomColor: '#1E293B', borderBottomWidth: '1px', borderBottomStyle: 'solid' }"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl"
          style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
        >
          <FileText class="h-5 w-5 text-white" />
        </div>
        <div v-if="!collapsed" class="flex flex-col">
          <span class="font-bold text-sm tracking-tight" style="color: #F8FAFC;">OCR 文档</span>
          <span
            class="text-[10px] uppercase tracking-widest font-medium"
            style="color: #64748B;"
          >
            审计系统
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation Label -->
    <div v-if="!collapsed" class="px-4 pt-5 pb-2">
      <span
        class="text-[10px] font-semibold uppercase tracking-wider"
        style="color: #475569;"
      >
        主导航
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 px-3">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="navigateTo(item.id)"
        :class="[
          'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        ]"
        :style="{
          backgroundColor: activeTab === item.id ? '#1E293B' : 'transparent',
          color: activeTab === item.id ? '#3B82F6' : '#94A3B8'
        }"
      >
        <div
          v-if="activeTab === item.id"
          class="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
          style="backgroundColor: '#3B82F6'"
        />
        <div
          :class="[
            'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200',
          ]"
          :style="{
            backgroundColor: activeTab === item.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          }"
        >
          <component
            :is="item.icon"
            class="h-[18px] w-[18px]"
            :style="{ color: activeTab === item.id ? '#3B82F6' : '#64748B' }"
          />
        </div>
        <span v-if="!collapsed" class="flex-1 text-left">{{ item.label }}</span>
        <div
          v-if="activeTab === item.id && !collapsed"
          class="h-2 w-2 rounded-full animate-pulse"
          style="backgroundColor: '#3B82F6'"
        />
      </button>
    </nav>

    <!-- Divider -->
    <div class="mx-3" style="borderTopWidth: '1px', borderTopColor: '#1E293B', borderTopStyle: 'solid'" />

    <!-- Bottom Section -->
    <div class="p-3 space-y-1">
      <button
        class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
        style="color: #94A3B8;"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200"
          style="backgroundColor: rgba(255, 255, 255, 0.05);"
        >
          <Settings class="h-[18px] w-[18px]" />
        </div>
        <span v-if="!collapsed">系统设置</span>
      </button>
      <button
        @click="$emit('update:collapsed', !collapsed)"
        class="flex w-full items-center justify-center rounded-lg px-3 py-2.5 transition-all duration-200"
        style="color: #64748BB;"
      >
        <ChevronRight
          :class="['h-5 w-5 transition-transform duration-300', !collapsed && 'rotate-180']"
        />
        <span v-if="!collapsed" class="ml-2 text-sm">收起</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Upload,
  ScanText,
  GitCompare,
  CheckSquare,
  ClipboardList,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-vue-next'

type TabType = 'upload' | 'ocr' | 'compare' | 'proofread' | 'audit'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

const activeTab = computed<TabType>(() => {
  const path = route.path
  if (path.includes('/upload')) return 'upload'
  if (path.includes('/ocr')) return 'ocr'
  if (path.includes('/compare')) return 'compare'
  if (path.includes('/proofread')) return 'proofread'
  if (path.includes('/audit')) return 'audit'
  return 'audit'
})

const navItems = [
  { id: 'upload' as TabType, label: '文件上传', icon: Upload },
  { id: 'ocr' as TabType, label: 'OCR 识别', icon: ScanText },
  { id: 'compare' as TabType, label: '文件对比', icon: GitCompare },
  { id: 'proofread' as TabType, label: '内容校对', icon: CheckSquare },
  { id: 'audit' as TabType, label: 'OCR 审计', icon: ClipboardList },
]

const navigateTo = (tab: TabType) => {
  router.push(`/${tab}`)
}
</script>
