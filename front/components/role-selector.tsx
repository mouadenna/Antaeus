"use client"
import { Button } from "@/components/ui/button"
import { Users, User } from "lucide-react"

interface RoleSelectorProps {
  currentRole: "user" | "admin"
  onRoleChange: (role: "user" | "admin") => void
}

export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-full p-1 border shadow-sm">
      <Button
        variant={currentRole === "user" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full flex items-center gap-2 ${
          currentRole === "user" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
        onClick={() => onRoleChange("user")}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Affected Person</span>
      </Button>
      <Button
        variant={currentRole === "admin" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full flex items-center gap-2 ${
          currentRole === "admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        }`}
        onClick={() => onRoleChange("admin")}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Responder</span>
      </Button>
    </div>
  )
}

