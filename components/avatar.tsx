"use client"

import { cn } from "@/lib/utils"

/**
 * DiceBear avatar system.
 * Stored in profiles.avatar_url as "dicebear:<style>" (e.g. "dicebear:notionists").
 * Avatar is generated deterministically from the user's email as seed.
 */

export const DICEBEAR_STYLES = [
  { id: "notionists", name: "Notion" },
  { id: "avataaars", name: "Cartoon" },
  { id: "bottts", name: "Robots" },
  { id: "lorelei", name: "Minimal" },
  { id: "fun-emoji", name: "Emoji" },
  { id: "thumbs", name: "Thumbs" },
  { id: "adventurer", name: "Explorer" },
  { id: "big-smile", name: "Smiley" },
  { id: "pixel-art", name: "Pixel" },
] as const

export type DiceBearStyle = (typeof DICEBEAR_STYLES)[number]["id"]

const DEFAULT_STYLE: DiceBearStyle = "notionists"

export function getDiceBearUrl(seed: string, style: DiceBearStyle = DEFAULT_STYLE, size = 128): string {
  const encodedSeed = encodeURIComponent(seed.toLowerCase().trim())
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodedSeed}&size=${size}`
}

function getStyleFromAvatarUrl(avatarUrl: string | null | undefined): DiceBearStyle {
  if (!avatarUrl?.startsWith("dicebear:")) return DEFAULT_STYLE
  const style = avatarUrl.split(":")[1] as DiceBearStyle
  return DICEBEAR_STYLES.some((s) => s.id === style) ? style : DEFAULT_STYLE
}

function getSeed(email?: string, name?: string): string {
  return email || name || "default"
}

interface AvatarDisplayProps {
  avatarUrl?: string | null
  email?: string
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-16 w-16",
}

const sizePx = { sm: 28, md: 36, lg: 64 }

export function AvatarDisplay({ avatarUrl, email, name, size = "md", className }: AvatarDisplayProps) {
  const style = getStyleFromAvatarUrl(avatarUrl)
  const seed = getSeed(email, name)
  const url = getDiceBearUrl(seed, style, sizePx[size] * 2) // 2x for retina

  return (
    <img
      src={url}
      alt={name || email || "Avatar"}
      className={cn("rounded-full bg-secondary", sizeClasses[size], className)}
      width={sizePx[size]}
      height={sizePx[size]}
    />
  )
}

interface AvatarPickerProps {
  currentAvatar?: string | null
  name?: string
  email?: string
  onSelect: (avatarUrl: string) => void
}

export function AvatarPicker({ currentAvatar, name, email, onSelect }: AvatarPickerProps) {
  const seed = getSeed(email, name)
  const currentStyle = getStyleFromAvatarUrl(currentAvatar)

  return (
    <div>
      <p className="text-sm font-medium text-foreground">Choose an avatar style</p>
      <p className="mt-1 text-sm text-muted-foreground">Each style generates a unique avatar from your identity.</p>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {DICEBEAR_STYLES.map((s) => {
          const isSelected = currentStyle === s.id
          const url = getDiceBearUrl(seed, s.id, 96)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(`dicebear:${s.id}`)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
                isSelected
                  ? "border-foreground bg-muted"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <img
                src={url}
                alt={s.name}
                className="h-12 w-12 rounded-full bg-secondary"
                width={48}
                height={48}
              />
              <span className="text-xs font-medium text-muted-foreground">{s.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
