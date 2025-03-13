"use client"

import { useState } from "react"
import { X, AlertTriangle, Bell, Info, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface Notification {
  id: string
  title: string
  message: string
  type: "alert" | "info" | "success" | "warning"
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  removeNotification: (id: string) => void
}

export default function NotificationSystem({ notifications, removeNotification }: NotificationSystemProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg shadow-lg p-4 flex items-start gap-3 ${
              notification.type === "alert"
                ? "bg-red-50 border-l-4 border-red-500"
                : notification.type === "warning"
                  ? "bg-amber-50 border-l-4 border-amber-500"
                  : notification.type === "success"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-blue-50 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex-shrink-0">
              {notification.type === "alert" && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {notification.type === "warning" && <Bell className="h-5 w-5 text-amber-500" />}
              {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {notification.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-700">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id"> & { id?: string }) => {
    const id = notification.id || Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return { notifications, addNotification, removeNotification }
}

