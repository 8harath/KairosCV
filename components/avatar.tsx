"use client"

import { cn } from "@/lib/utils"

/**
 * Preset avatar palette — simple colored backgrounds with initials or emoji.
 * Stored in profiles.avatar_url as "preset:<index>" (e.g. "preset:3").
 */
export const AVATAR_PRESETS = [
  { bg: "#E8D5B7", emoji: "K" },
  { bg: "#F0B4B4", emoji: "R" },
  { bg: "#B4D8F0", emoji: "B" },
  { bg: "#B7E8C8", emoji: "G" },
  { bg: "#D8B4F0", emoji: "P" },
  { bg: "#F0D8B4", emoji: "O" },
  { bg: "#B4F0E8", emoji: "T" },
  { bg: "#F0B4D8", emoji: "M" },
  { bg: "#D5D5D5", emoji: "S" },
  { bg: "#C8E0B4", emoji: "L" },
  { bg: "#E0C8F0", emoji: "V" },
  { bg: "#F0E0B4", emoji: "Y" },
] as const

interface AvatarDisplayProps {
  avatarUrl?: string | null
  email?: string
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function getPresetFromUrl(avatarUrl: string | null | undefined): (typeof AVATAR_PRESETS)[number] | null {
  if (!avatarUrl?.startsWith("preset:")) return null
  const index = parseInt(avatarUrl.split(":")[1], 10)
  return AVATAR_PRESETS[index] ?? null
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0][0]?.toUpperCase() || "?"
  }
  if (email) return email[0]?.toUpperCase() || "?"
  return "?"
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-16 w-16 text-xl",
}

export function AvatarDisplay({ avatarUrl, email, name, size = "md", className }: AvatarDisplayProps) {
  const preset = getPresetFromUrl(avatarUrl)
  const initials = getInitials(name, email)

  if (preset) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-full font-semibold text-foreground", sizeClasses[size], className)}
        style={{ backgroundColor: preset.bg }}
      >
        {initials}
      </div>
    )
  }

  // Default: neutral background with initials
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-secondary font-semibold text-foreground", sizeClasses[size], className)}>
      {initials}
    </div>
  )
}

interface AvatarPickerProps {
  currentAvatar?: string | null
  name?: string
  email?: string
  onSelect: (avatarUrl: string) => void
}

export function AvatarPicker({ currentAvatar, name, email, onSelect }: AvatarPickerProps) {
  const initials = getInitials(name, email)

  return (
    <div>
      <p className="text-sm font-medium text-foreground">Choose an avatar</p>
      <p className="mt-1 text-sm text-muted-foreground">Select a color for your profile avatar.</p>
      <div className="mt-4 grid grid-cols-6 gap-2">
        {AVATAR_PRESETS.map((preset, index) => {
          const value = `preset:${index}`
          const isSelected = currentAvatar === value
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(value)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-foreground transition-all",
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-2 hover:ring-border hover:ring-offset-1 hover:ring-offset-background"
              )}
              style={{ backgroundColor: preset.bg }}
              aria-label={`Avatar color ${index + 1}`}
            >
              {initials}
            </button>
          )
        })}
      </div>
    </div>
  )
}
