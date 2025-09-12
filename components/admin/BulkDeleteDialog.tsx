"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Trash2 } from "lucide-react"

interface BulkDeleteDialogProps {
  productIds: string[]
  productNames: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteProducts: (ids: string[]) => Promise<void>
}

export function BulkDeleteDialog({ productIds, productNames, open, onOpenChange, onDeleteProducts }: BulkDeleteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (productIds.length === 0) return

    console.log("BulkDeleteDialog: Starting delete process for products:", productIds)
    setLoading(true)
    setError(null)

    try {
      await onDeleteProducts(productIds)
      console.log("BulkDeleteDialog: Delete successful, closing dialog")
      onOpenChange(false)
    } catch (error) {
      console.error('BulkDeleteDialog: Error deleting products:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete products')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete {productIds.length} Products
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {productIds.length} selected products? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {productNames.length > 0 && (
          <div className="max-h-32 overflow-y-auto">
            <p className="text-sm font-medium mb-2">Products to be deleted:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {productNames.slice(0, 5).map((name, index) => (
                <li key={index} className="truncate">• {name}</li>
              ))}
              {productNames.length > 5 && (
                <li className="text-gray-500">... and {productNames.length - 5} more</li>
              )}
            </ul>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {productIds.length} Products
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
