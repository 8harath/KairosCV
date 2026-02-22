import path from "path"

const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const
const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const

export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number]

export function getSafeExtension(filename: string): SupportedExtension | null {
  const ext = path.extname(filename).toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(ext as SupportedExtension)
    ? (ext as SupportedExtension)
    : null
}

export function isAllowedMimeType(type: string): boolean {
  return SUPPORTED_MIME_TYPES.includes(type as (typeof SUPPORTED_MIME_TYPES)[number])
}

export function isValidFileSignature(buffer: Buffer, extension: SupportedExtension): boolean {
  if (extension === ".pdf") {
    // PDF files start with `%PDF`
    return buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "%PDF"
  }

  if (extension === ".docx") {
    // DOCX is a ZIP container and starts with PK\x03\x04 or related ZIP signatures.
    return (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      [0x03, 0x05, 0x07].includes(buffer[2]) &&
      [0x04, 0x06, 0x08].includes(buffer[3])
    )
  }

  if (extension === ".txt") {
    // Plain text can start with many bytes; reject known binary signatures.
    const binarySignatures = [
      Buffer.from([0x25, 0x50, 0x44, 0x46]), // PDF
      Buffer.from([0x50, 0x4b, 0x03, 0x04]), // ZIP
      Buffer.from([0x89, 0x50, 0x4e, 0x47]), // PNG
      Buffer.from([0xff, 0xd8, 0xff]), // JPEG
    ]
    return !binarySignatures.some((sig) => buffer.subarray(0, sig.length).equals(sig))
  }

  return false
}
