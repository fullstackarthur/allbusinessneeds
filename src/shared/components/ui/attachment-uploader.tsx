import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { Upload, X, FileText, File, Image, FileArchive } from 'lucide-react'

interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

interface AttachmentUploaderProps {
  files: FileAttachment[]
  onFilesChange: (files: FileAttachment[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  className?: string
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image className="h-4 w-4" />
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <FileArchive className="h-4 w-4" />
  if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentUploader({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip'],
  className,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    setError(null)

    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const maxSize = maxSizeMB * 1024 * 1024
    const attachments: FileAttachment[] = []

    Array.from(newFiles).forEach((file) => {
      if (file.size > maxSize) {
        setError(`${file.name} exceeds ${maxSizeMB}MB limit`)
        return
      }

      attachments.push({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        type: file.type,
      })
    })

    if (attachments.length > 0) {
      onFilesChange([...files, ...attachments])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
    setError(null)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary-muted/50'
            : 'border-border bg-surface hover:border-border-strong',
        )}
      >
        <Upload className={cn(
          'h-6 w-6 mb-2 transition-colors',
          isDragging ? 'text-primary' : 'text-text-muted',
        )} />
        <p className="text-sm font-medium text-text">
          {isDragging ? 'Drop files here' : 'Upload files'}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Drag & drop or click to browse
        </p>
        <p className="mt-1 text-[10px] text-text-muted">
          Max {maxFiles} files, {maxSizeMB}MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-active text-text-muted">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{file.name}</p>
                <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="rounded-md p-1.5 text-text-muted hover:bg-destructive-muted hover:text-destructive transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { AttachmentUploader }
export type { FileAttachment }
