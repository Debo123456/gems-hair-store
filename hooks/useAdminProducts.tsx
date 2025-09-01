"use client"

import { useState, useEffect } from 'react'
import { AdminProductService, AdminProduct, CreateProductData, UpdateProductData } from '@/lib/adminProductService'

interface UseAdminProductsOptions {
  page?: number
  limit?: number
  search?: string
  category?: string
  inStock?: boolean
  sortBy?: 'name' | 'price' | 'created_at' | 'updated_at'
  sortOrder?: 'asc' | 'desc'
}

interface UseAdminProductsReturn {
  products: AdminProduct[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  refresh: () => Promise<void>
  createProduct: (data: CreateProductData) => Promise<void>
  updateProduct: (data: UpdateProductData) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  deleteProducts: (ids: string[]) => Promise<void>
  updateOptions: (options: Partial<UseAdminProductsOptions>) => void
}

export function useAdminProducts(initialOptions: UseAdminProductsOptions = {}): UseAdminProductsReturn {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialOptions.page || 1)
  const [totalPages, setTotalPages] = useState(0)
  const [options, setOptions] = useState<UseAdminProductsOptions>({
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc',
    ...initialOptions
  })

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await AdminProductService.getProducts(options)
      setProducts(result.products)
      setTotal(result.total)
      setPage(result.page)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchProducts()
  }

  const createProduct = async (data: CreateProductData) => {
    try {
      await AdminProductService.createProduct(data)
      await refresh() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
      throw err
    }
  }

  const updateProduct = async (data: UpdateProductData) => {
    try {
      await AdminProductService.updateProduct(data)
      await refresh() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await AdminProductService.deleteProduct(id)
      await refresh() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      throw err
    }
  }

  const deleteProducts = async (ids: string[]) => {
    try {
      await AdminProductService.deleteProducts(ids)
      await refresh() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete products')
      throw err
    }
  }

  const updateOptions = (newOptions: Partial<UseAdminProductsOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }))
  }

  useEffect(() => {
    fetchProducts()
  }, [options])

  return {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    updateOptions
  }
}
