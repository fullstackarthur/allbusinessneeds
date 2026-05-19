import * as React from 'react'
import { ProductCard } from '@/shared/components/ui/product-card'
import { ProductCardSkeleton } from '@/shared/components/ui/skeleton'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import type { Product } from '@/domain/entities'
import { useRfqDraftStore } from '@/presentation/stores/rfq-draft-store'
import { Search, Package } from 'lucide-react'

function HomePage() {
  const addItem = useRfqDraftStore((state) => state.addItem)
  const initialize = useRfqDraftStore((state) => state.initialize)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    initialize()
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [initialize])

  const handleAddToRfq = React.useCallback(
    (product: Product) => {
      addItem({
        productId: product.id,
        productName: product.name,
        quantity: product.minOrderQuantity,
      })
    },
    [addItem],
  )

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Premium A4 Copy Paper - 80gsm (Box of 5 Reams)',
      description: 'High-quality white copy paper for everyday office use',
      sku: 'PPR-A4-80-5R',
      category: 'paper',
      brand: 'PaperPro',
      price: 24.99,
      currency: 'USD',
      stock: 150,
      minOrderQuantity: 1,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=A4+Paper',
      attributes: { weight: '80gsm', size: 'A4' },
      rating: 4.7,
      reviewCount: 89,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Ballpoint Pen - Blue Ink (Box of 50)',
      description: 'Smooth-writing ballpoint pens for professional use',
      sku: 'PEN-BP-BL-50',
      category: 'writing',
      brand: 'WriteWell',
      price: 12.50,
      currency: 'USD',
      stock: 3,
      minOrderQuantity: 1,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Ballpoint+Pen',
      attributes: { color: 'Blue', type: 'Ballpoint' },
      rating: 4.5,
      reviewCount: 156,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Desktop Organizer - Bamboo',
      description: 'Sustainable bamboo desk organizer with multiple compartments',
      sku: 'ORG-DSK-BB',
      category: 'organization',
      brand: 'EcoDesk',
      price: 34.00,
      currency: 'USD',
      stock: 0,
      minOrderQuantity: 1,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Organizer',
      attributes: { material: 'Bamboo' },
      rating: 4.8,
      reviewCount: 42,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'Sticky Notes Assorted - 12 Pads',
      description: 'Colorful sticky notes in various sizes for quick reminders',
      sku: 'STK-AST-12',
      category: 'paper',
      brand: 'NoteMaster',
      price: 8.99,
      currency: 'USD',
      stock: 200,
      minOrderQuantity: 2,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Sticky+Notes',
      attributes: { count: '12 pads', sizes: 'Mixed' },
      rating: 4.3,
      reviewCount: 201,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '5',
      name: 'Binder Clips - Assorted Sizes (120 Pack)',
      description: 'Durable steel binder clips in small, medium, and large sizes',
      sku: 'CLP-BND-AST',
      category: 'clips',
      brand: 'ClipPro',
      price: 6.75,
      currency: 'USD',
      stock: 500,
      minOrderQuantity: 1,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Binder+Clips',
      attributes: { material: 'Steel', count: '120' },
      rating: 4.6,
      reviewCount: 78,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '6',
      name: 'Whiteboard Markers - Assorted Colors (Set of 12)',
      description: 'Vibrant, low-odor whiteboard markers with fine tips',
      sku: 'MRK-WB-12',
      category: 'writing',
      brand: 'MarkIt',
      price: 15.99,
      currency: 'USD',
      stock: 75,
      minOrderQuantity: 1,
      images: [],
      thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Markers',
      attributes: { colors: '12', tip: 'Fine' },
      rating: 4.4,
      reviewCount: 93,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Procurement Catalog</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse and request quotations for office supplies
        </p>
      </div>

      <div className="relative">
        <Input
          placeholder="Search products, SKUs, categories..."
          icon={<Search className="h-4 w-4" />}
          className="max-w-xl"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : mockProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or browse categories"
          icon={<Package className="h-8 w-8" />}
          action={<Button variant="outline">Browse categories</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToRfq={handleAddToRfq}
              onView={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { HomePage }
