"use client"

import { cn } from "@/lib/utils"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type TabType = "upload" | "ocr" | "compare" | "proofread" | "audit"

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const navItems = [
  { id: "upload" as TabType, label: "文件上传", icon: Upload },
  { id: "ocr" as TabType, label: "OCR 识别", icon: ScanText },
  { id: "compare" as TabType, label: "文件对比", icon: GitCompare },
  { id: "proofread" as TabType, label: "内容校对", icon: CheckSquare },
  { id: "audit" as TabType, label: "OCR 审计", icon: ClipboardList },
]

export function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out shadow-md",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground">
                OCR 文档
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                审计系统
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            主导航
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
              )}
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-muted group-hover:bg-muted/80"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-transform duration-200",
                    isActive ? "" : "group-hover:scale-110"
                  )}
                />
              </div>
              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-sidebar-border" />

      {/* Bottom Section */}
      <div className="p-3 space-y-1">
        <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors duration-200">
            <Settings className="h-[18px] w-[18px]" />
          </div>
          {!collapsed && <span>系统设置</span>}
        </button>

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center h-11 transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted",
            collapsed ? "px-0" : "px-3"
          )}
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              !collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="ml-2 text-sm">收起</span>}
        </Button>
      </div>
    </aside>
  )
}
