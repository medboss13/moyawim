"use client"

import { useAuth } from "@/lib/auth-context"
import { EmployerDashboard } from "@/components/dashboard/employer-dashboard"
import { WorkerDashboard } from "@/components/dashboard/worker-dashboard"

export default function DashboardPage() {
  const { userData } = useAuth()

  if (userData?.role === "worker") {
    return <WorkerDashboard />
  }

  return <EmployerDashboard />
}
