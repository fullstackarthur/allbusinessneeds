import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { Grid3X3, ChevronRight } from 'lucide-react'
import { useCategories } from '@/shared/hooks/use-supabase-data'

function CategoriesPage() {
  const { categories, loading } = useCategories()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 rounded bg-surface-active animate-pulse" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-6">
              <div className="h-5 w-32 rounded bg-surface-active animate-pulse" />
              <div className="mt-2 h-4 w-48 rounded bg-surface-active animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">Categories</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse products by category
        </p>
      </div>

      {categories.length === 0 ? (
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
                  {category.productCount > 0 ? `${category.productCount} products` : 'Browse products'}
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
