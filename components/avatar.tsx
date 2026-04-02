"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * DiceBear avatar system.
 * Stored in profiles.avatar_url as "dicebear:<style>" (e.g. "dicebear:notionists").
 * Avatar is generated deterministically from the user's email as seed.
 */

const CATEGORIES = {
  all: "All",
  people: "People",
  abstract: "Abstract",
  fun: "Fun",
} as const

type Category = keyof typeof CATEGORIES

interface StyleDef {
  id: string
  name: string
  category: Category
}

export const DICEBEAR_STYLES: StyleDef[] = [
  // People
  { id: "notionists", name: "Notion", category: "people" },
  { id: "notionists-neutral", name: "Notion Neutral", category: "people" },
  { id: "avataaars", name: "Cartoon", category: "people" },
  { id: "avataaars-neutral", name: "Cartoon Neutral", category: "people" },
  { id: "adventurer", name: "Explorer", category: "people" },
  { id: "adventurer-neutral", name: "Explorer Neutral", category: "people" },
  { id: "big-ears", name: "Big Ears", category: "people" },
  { id: "big-ears-neutral", name: "Big Ears Neutral", category: "people" },
  { id: "big-smile", name: "Smiley", category: "people" },
  { id: "croodles", name: "Croodles", category: "people" },
  { id: "croodles-neutral", name: "Croodles Neutral", category: "people" },
  { id: "dylan", name: "Dylan", category: "people" },
  { id: "lorelei", name: "Lorelei", category: "people" },
  { id: "lorelei-neutral", name: "Lorelei Neutral", category: "people" },
  { id: "micah", name: "Micah", category: "people" },
  { id: "miniavs", name: "Miniavs", category: "people" },
  { id: "open-peeps", name: "Open Peeps", category: "people" },
  { id: "personas", name: "Personas", category: "people" },

  // Fun
  { id: "fun-emoji", name: "Emoji", category: "fun" },
  { id: "thumbs", name: "Thumbs", category: "fun" },
  { id: "bottts", name: "Robots", category: "fun" },
  { id: "bottts-neutral", name: "Robots Neutral", category: "fun" },
  { id: "pixel-art", name: "Pixel Art", category: "fun" },
  { id: "pixel-art-neutral", name: "Pixel Neutral", category: "fun" },

  // Abstract
  { id: "identicon", name: "Identicon", category: "abstract" },
  { id: "initials", name: "Initials", category: "abstract" },
  { id: "shapes", name: "Shapes", category: "abstract" },
  { id: "rings", name: "Rings", category: "abstract" },
  { id: "glass", name: "Glass", category: "abstract" },
  { id: "icons", name: "Icons", category: "abstract" },
]

export type DiceBearStyle = string

const DEFAULT_STYLE = "notionists"

export function getDiceBearUrl(seed: string, style: string = DEFAULT_STYLE, size = 128): string {
  const encodedSeed = encodeURIComponent(seed.toLowerCase().trim())
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodedSeed}&size=${size}`
}

function getStyleFromAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl?.startsWith("dicebear:")) return DEFAULT_STYLE
  const style = avatarUrl.split(":")[1]
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
  const url = getDiceBearUrl(seed, style, sizePx[size] * 2)

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
  const [filter, setFilter] = useState<Category>("all")

  const filtered = filter === "all"
    ? DICEBEAR_STYLES
    : DICEBEAR_STYLES.filter((s) => s.category === filter)

  return (
    <div>
      <p className="text-sm font-medium text-foreground">Choose an avatar style</p>
      <p className="mt-1 text-sm text-muted-foreground">Each style generates a unique avatar from your identity.</p>

      {/* Category filter tabs */}
      <div className="mt-4 flex gap-1 border-b border-border pb-px">
        {(Object.entries(CATEGORIES) as [Category, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors",
              filter === key
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Avatar grid */}
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {filtered.map((s) => {
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
