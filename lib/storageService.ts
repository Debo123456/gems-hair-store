import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface ImageUploadOptions {
  folder?: string
  fileName?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export class StorageService {
  private static readonly BUCKET_NAME = 'product-images'
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  /**
   * Upload an image file to Supabase Storage
   */
  static async uploadImage(
    file: File,
    options: ImageUploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, options)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Generate unique filename
      const fileName = options.fileName || this.generateFileName(file.name)
      const folder = options.folder || 'products'
      const filePath = `${folder}/${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error('Storage service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(imageUrl: string): Promise<UploadResult> {
    try {
      // Check if URL is valid and is a Supabase Storage URL
      if (!this.isValidSupabaseStorageUrl(imageUrl)) {
        console.warn('Invalid or non-Supabase Storage URL, skipping delete:', imageUrl)
        return { success: true } // Return success for non-Supabase URLs
      }

      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(imageUrl)
      if (!filePath) {
        return { success: false, error: 'Invalid image URL' }
      }

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }

  /**
   * Get a signed URL for private access (if needed)
   */
  static async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        console.error('Signed URL error:', error)
        return null
      }

      return data.signedUrl
    } catch (error) {
      console.error('Signed URL service error:', error)
      return null
    }
  }

  /**
   * List images in a folder
   */
  static async listImages(folder: string = 'products'): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder)

      if (error) {
        console.error('List images error:', error)
        return []
      }

      return data.map(file => file.name)
    } catch (error) {
      console.error('List images service error:', error)
      return []
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File, options: ImageUploadOptions): { valid: boolean; error?: string } {
    // Check file size
    const maxSize = options.maxSize || this.MAX_FILE_SIZE
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    // Check file type
    const allowedTypes = options.allowedTypes || this.ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(', ')}`
      }
    }

    return { valid: true }
  }

  /**
   * Generate unique filename
   */
  private static generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${randomString}.${extension}`
  }

  /**
   * Check if URL is a valid Supabase Storage URL
   */
  private static isValidSupabaseStorageUrl(url: string): boolean {
    try {
      // Handle empty or invalid URLs
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return false
      }

      // If it's a relative path, consider it valid
      if (url.startsWith('products/') || (!url.startsWith('http') && !url.includes('://'))) {
        return true
      }

      const urlObj = new URL(url)
      // Check if it's a Supabase Storage URL
      return urlObj.hostname.includes('supabase') && 
             urlObj.pathname.includes(`/${this.BUCKET_NAME}/`)
    } catch (error) {
      return false
    }
  }

  /**
   * Extract file path from Supabase Storage URL
   */
  private static extractFilePathFromUrl(url: string): string | null {
    try {
      // Handle empty or invalid URLs
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return null
      }

      // If it's already a relative path (starts with products/), return as is
      if (url.startsWith('products/')) {
        return url
      }

      // If it's a relative path without the products/ prefix, add it
      if (!url.startsWith('http') && !url.includes('://') && !url.startsWith('/')) {
        return `products/${url}`
      }

      // If it's a full URL, extract the path
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split('/')
        const bucketIndex = pathParts.findIndex(part => part === this.BUCKET_NAME)
        
        if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
          return null
        }

        return pathParts.slice(bucketIndex + 1).join('/')
      }

      return null
    } catch (error) {
      console.error('Error extracting file path:', error)
      return null
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  static getOptimizedImageUrl(imageUrl: string, width?: number, height?: number, quality: number = 80): string {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return imageUrl || ''
    }

    try {
      // If it's not a full URL, return as is (might be a relative path or placeholder)
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return imageUrl
      }

      // Check if it's a valid URL first
      const url = new URL(imageUrl)
      
      // Only optimize Supabase Storage URLs
      if (this.isValidSupabaseStorageUrl(imageUrl)) {
        if (width) url.searchParams.set('width', width.toString())
        if (height) url.searchParams.set('height', height.toString())
        url.searchParams.set('quality', quality.toString())
        url.searchParams.set('format', 'webp')
      }

      return url.toString()
    } catch (error) {
      // If URL is invalid, return the original URL
      console.warn('Invalid URL for optimization, returning original:', imageUrl)
      return imageUrl
    }
  }
}
