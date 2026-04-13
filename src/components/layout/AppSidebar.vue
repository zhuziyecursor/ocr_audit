<template>
  <aside
    :class="[
      'flex flex-col border-r border-border bg-sidebar transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center border-b border-sidebar-border px-4">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <FileText class="h-4 w-4 text-primary-foreground" />
        </div>
        <span v-if="!collapsed" class="font-semibold text-sidebar-foreground">
          OCR 文档处理
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 p-3">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="navigateTo(item.id)"
        :class="[
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          activeTab === item.id
            ? 'bg-sidebar-accent text-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
        ]"
      >
        <component :is="item.icon" :class="['h-5 w-5 shrink-0', activeTab === item.id && 'text-primary']" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Settings & Collapse -->
    <div class="border-t border-sidebar-border p-3">
      <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground">
        <Settings class="h-5 w-5 shrink-0" />
        <span v-if="!collapsed">设置</span>
      </button>
      <button
        @click="$emit('update:collapsed', !collapsed)"
        class="mt-2 flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <ChevronRight v-if="collapsed" class="h-4 w-4" />
        <ChevronLeft v-else class="h-4 w-4" />
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
  ChevronLeft,
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
  return 'upload'
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
