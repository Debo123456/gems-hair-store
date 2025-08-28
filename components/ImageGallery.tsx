"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageGallery({ images, alt, className = "" }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Touch gesture handling for pinch-to-zoom
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null)
  const [initialScale, setInitialScale] = useState(1)

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetImageTransform()
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetImageTransform()
  }

  const resetImageTransform = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
    setIsZoomed(false)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 3))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5))
    if (scale <= 1) {
      setIsZoomed(false)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => prev + 90)
  }

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start drag
      if (!isZoomed) return
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    } else if (e.touches.length === 2) {
      // Two touches - start pinch
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setTouchStart({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        distance,
      })
      setInitialScale(scale)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      // Single touch - continue drag
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    } else if (e.touches.length === 2 && touchStart) {
      // Two touches - continue pinch
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const newScale = (distance / touchStart.distance) * initialScale
      setScale(Math.max(0.5, Math.min(newScale, 3)))
      setIsZoomed(newScale > 1)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTouchStart(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'Escape':
          resetImageTransform()
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case 'r':
          handleRotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scale, isZoomed])

  // Reset transform when image changes
  useEffect(() => {
    resetImageTransform()
  }, [currentImageIndex])

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <span className="text-4xl">🖼️</span>
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full touch-manipulation"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full touch-manipulation"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Quick View Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 touch-manipulation"
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-full">
              {/* Full Screen Image Viewer */}
              <div 
                ref={containerRef}
                className="relative w-full h-full overflow-hidden bg-black"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-6xl">🖼️</span>
                  </div>
                </div>

                {/* Navigation Controls */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full touch-manipulation"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full touch-manipulation"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full touch-manipulation"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full touch-manipulation"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full touch-manipulation"
                    onClick={handleRotate}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full touch-manipulation"
                    onClick={resetImageTransform}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Touch Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black/50 px-4 py-2 rounded-lg">
                  <p className="text-sm">
                    {isZoomed ? 'Drag to move • Pinch to zoom • Double tap to reset' : 'Pinch to zoom • Double tap to reset'}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? 'border-purple-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-lg">🖼️</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
