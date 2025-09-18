"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { StorageService, UploadResult } from "@/lib/storageService"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  onError?: (error: string) => void
  label?: string
  placeholder?: string
  maxSize?: number
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onError,
  label = "Image",
  placeholder = "Click to upload an image",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      onError?.('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      onError?.(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const result: UploadResult = await StorageService.uploadImage(file, {
        folder: 'products',
        maxSize
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url) {
        onChange(result.url)
        setPreview(result.url)
      } else {
        onError?.(result.error || 'Upload failed')
        setPreview(null)
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
      setPreview(null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [maxSize, onChange, onError])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleRemove = async () => {
    if (value) {
      // Try to delete from storage (will handle non-Supabase URLs gracefully)
      try {
        const result = await StorageService.deleteImage(value)
        if (!result.success) {
          console.warn('Failed to delete image from storage:', result.error)
        }
      } catch (error) {
        console.warn('Error deleting image from storage:', error)
      }
    }
    onChange(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${disabled || isUploading 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto rounded-lg object-cover"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
            )}
            <div className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : placeholder}
            </div>
            {isUploading && (
              <div className="w-full">
                <Progress value={uploadProgress} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">{uploadProgress}%</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 text-center">
        Supports JPEG, PNG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
      </div>
    </div>
  )
}
