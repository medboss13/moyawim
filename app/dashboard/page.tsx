"use client"

import { useAuth } from "@/lib/auth-context"
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard"
import { WorkerDashboard } from "@/components/dashboard/worker-dashboard"
import { WorkerSimpleDashboard } from "@/components/dashboard/worker-simple-dashboard"
import { UIModeChooser } from "@/components/dashboard/ui-mode-chooser"

export default function DashboardPage() {
  const { userData, getUIMode } = useAuth()

  // For workers, check if they have selected a UI mode
  if (userData?.role === "worker") {
    const uiMode = getUIMode()
    
    // Show UI mode chooser if no mode selected
    if (!uiMode) {
      return <UIModeChooser />
    }
    
    // Show simple dashboard if simple mode
    if (uiMode === "simple") {
      return <WorkerSimpleDashboard />
    }
    
    // Show standard dashboard
    return <WorkerDashboard />
  }

  return <EmployerDashboard />
}
