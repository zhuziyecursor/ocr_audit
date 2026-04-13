"use client"

import { useState } from "react"
import { Sidebar, type TabType } from "@/components/sidebar"
import { FileUpload } from "@/components/file-upload"
import { OcrRecognition } from "@/components/ocr-recognition"
import { FileCompare } from "@/components/file-compare"
import { ContentProofread } from "@/components/content-proofread"
import { OcrAudit } from "@/components/ocr-audit"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("upload")
  const [collapsed, setCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <FileUpload />
      case "ocr":
        return <OcrRecognition />
      case "compare":
        return <FileCompare />
      case "proofread":
        return <ContentProofread />
      case "audit":
        return <OcrAudit />
      default:
        return <FileUpload />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8 px-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
