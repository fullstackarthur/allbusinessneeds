import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { ListSkeleton } from '@/shared/components/ui/skeleton'
import { Grid3X3, ChevronRight } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  icon: React.ReactNode
}

const categories: CategoryItem[] = [
  { id: '1', name: 'Paper & Printing', slug: 'paper', description: 'Copy paper, notebooks, printing supplies', productCount: 145, icon: null },
  { id: '2', name: 'Writing Instruments', slug: 'writing', description: 'Pens, pencils, markers, highlighters', productCount: 98, icon: null },
  { id: '3', name: 'Filing & Organization', slug: 'organization', description: 'Folders, binders, desk organizers', productCount: 76, icon: null },
  { id: '4', name: 'Desk Accessories', slug: 'desk', description: 'Staplers, tape, scissors, rulers', productCount: 112, icon: null },
  { id: '5', name: 'Technology', slug: 'technology', description: 'USB drives, cables, batteries', productCount: 64, icon: null },
  { id: '6', name: 'Breakroom', slug: 'breakroom', description: 'Coffee, tea, snacks, supplies', productCount: 43, icon: null },
  { id: '7', name: 'Cleaning & Hygiene', slug: 'cleaning', description: 'Sanitizers, tissues, cleaning supplies', productCount: 58, icon: null },
  { id: '8', name: 'Shipping & Mailing', slug: 'shipping', description: 'Envelopes, boxes, tape, labels', productCount: 37, icon: null },
]

function CategoriesPage() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Categories</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse products by category
        </p>
      </div>

      {loading ? (
        <ListSkeleton count={8} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories available"
          icon={<Grid3X3 className="h-8 w-8" />}
        />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className={cn(
                'flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-all duration-150 hover:border-border-strong hover:shadow-sm',
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-muted">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{category.name}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {category.productCount} products
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export { CategoriesPage }
