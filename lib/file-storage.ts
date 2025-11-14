import fs from "fs-extra"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "uploads")
const GENERATED_DIR = path.join(UPLOADS_DIR, "generated")

// Ensure directories exist
export async function ensureUploadDirectories() {
  await fs.ensureDir(UPLOADS_DIR)
  await fs.ensureDir(GENERATED_DIR)
}

// Get file path for uploaded file
export function getUploadFilePath(fileId: string, extension: string): string {
  return path.join(UPLOADS_DIR, `${fileId}${extension}`)
}

// Get file path for generated PDF
export function getGeneratedFilePath(fileId: string): string {
  return path.join(GENERATED_DIR, `${fileId}.pdf`)
}

// Save uploaded file
export async function saveUploadedFile(fileId: string, file: File): Promise<string> {
  await ensureUploadDirectories()
  
  const extension = path.extname(file.name) || ".txt"
  const filePath = getUploadFilePath(fileId, extension)
  
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  await fs.writeFile(filePath, buffer)
  
  return filePath
}

// Check if file exists
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// Read file as buffer
export async function readFile(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath)
}

// Save generated PDF
export async function saveGeneratedPDF(fileId: string, pdfBuffer: Buffer): Promise<string> {
  await ensureUploadDirectories()
  
  const filePath = getGeneratedFilePath(fileId)
  await fs.writeFile(filePath, pdfBuffer)
  
  return filePath
}

// Get file metadata
export interface FileMetadata {
  fileId: string
  filename: string
  size: number
  type: string
  uploadedAt: Date
}

// Get metadata file path
function getMetadataFilePath(fileId: string): string {
  return path.join(UPLOADS_DIR, `${fileId}.meta.json`)
}

// Save file metadata to disk
export async function saveFileMetadata(metadata: FileMetadata): Promise<void> {
  await ensureUploadDirectories()
  const metadataPath = getMetadataFilePath(metadata.fileId)
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
}

// Get file metadata from disk
export async function getFileMetadata(fileId: string): Promise<FileMetadata | null> {
  try {
    const metadataPath = getMetadataFilePath(fileId)
    if (!(await fileExists(metadataPath))) {
      return null
    }
    const data = await fs.readFile(metadataPath, 'utf-8')
    const metadata = JSON.parse(data)
    // Convert uploadedAt back to Date object
    metadata.uploadedAt = new Date(metadata.uploadedAt)
    return metadata
  } catch (error) {
    console.error('Error reading metadata:', error)
    return null
  }
}

