import * as React from 'react'
import { cn } from '@/shared/lib/utils'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Button } from '@/shared/components/ui/button'
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  type: 'checkbox' | 'range'
}

const filterGroups: FilterGroup[] = [
  {
    id: 'brand',
    label: 'Brand',
    type: 'checkbox',
    options: [
      { id: 'paperpro', label: 'PaperPro', count: 23 },
      { id: 'writewell', label: 'WriteWell', count: 18 },
      { id: 'notemaster', label: 'NoteMaster', count: 12 },
      { id: 'clippro', label: 'ClipPro', count: 9 },
      { id: 'ecodesk', label: 'EcoDesk', count: 7 },
      { id: 'markit', label: 'MarkIt', count: 15 },
    ],
  },
  {
    id: 'availability',
    label: 'Availability',
    type: 'checkbox',
    options: [
      { id: 'in-stock', label: 'In stock', count: 412 },
      { id: 'low-stock', label: 'Low stock', count: 28 },
      { id: 'out-of-stock', label: 'Out of stock', count: 15 },
    ],
  },
  {
    id: 'material',
    label: 'Material',
    type: 'checkbox',
    options: [
      { id: 'paper', label: 'Paper', count: 89 },
      { id: 'plastic', label: 'Plastic', count: 67 },
      { id: 'metal', label: 'Metal', count: 34 },
      { id: 'bamboo', label: 'Bamboo', count: 12 },
      { id: 'recycled', label: 'Recycled', count: 45 },
    ],
  },
  {
    id: 'pack-size',
    label: 'Pack Size',
    type: 'checkbox',
    options: [
      { id: 'single', label: 'Single unit', count: 120 },
      { id: 'pack-10', label: 'Pack of 10', count: 85 },
      { id: 'pack-50', label: 'Pack of 50', count: 67 },
      { id: 'box', label: 'Box (100+)', count: 43 },
    ],
  },
  {
    id: 'price-range',
    label: 'Price Range',
    type: 'range',
    options: [
      { id: 'under-10', label: 'Under $10', count: 156 },
      { id: '10-25', label: '$10 - $25', count: 198 },
      { id: '25-50', label: '$25 - $50', count: 87 },
      { id: '50-100', label: '$50 - $100', count: 34 },
      { id: 'over-100', label: 'Over $100', count: 12 },
    ],
  },
]

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'name-asc', label: 'Name: A-Z' },
  { id: 'newest', label: 'Newest' },
]

interface FilterBarProps {
  activeFilters: Record<string, string[]>
  sortBy: string
  onFilterChange: (groupId: string, optionId: string) => void
  onSortChange: (sortId: string) => void
  onClearAll: () => void
  resultCount: number
  className?: string
}

function FilterBar({
  activeFilters,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearAll,
  resultCount,
  className,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = React.useState(false)
  const sortRef = React.useRef<HTMLDivElement>(null)
  const activeFilterCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0)
  const currentSort = sortOptions.find((s) => s.id === sortBy)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">{resultCount} results</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(activeFilters).map(([groupId, optionIds]) =>
          optionIds.map((optionId) => {
            const group = filterGroups.find((g) => g.id === groupId)
            const option = group?.options.find((o) => o.id === optionId)
            if (!option) return null

            return (
              <button
                key={`${groupId}-${optionId}`}
                onClick={() => onFilterChange(groupId, optionId)}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary-muted px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                {option.label}
                <X className="h-3 w-3" />
              </button>
            )
          }),
        )}
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-text-muted hover:text-text transition-colors"
        >
          Clear all
        </button>
      )}

      <div className="ml-auto relative" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
        >
          Sort: {currentSort?.label}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {sortOpen && (
          <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border bg-surface p-1 shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id)
                  setSortOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors',
                  option.id === sortBy
                    ? 'bg-surface-hover text-text font-medium'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                )}
              >
                {option.label}
                {option.id === sortBy && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  activeFilters: Record<string, string[]>
  onFilterChange: (groupId: string, optionId: string) => void
  onClearAll: () => void
  onApply: () => void
}

function FilterDrawer({
  open,
  onClose,
  activeFilters,
  onFilterChange,
  onClearAll,
  onApply,
}: FilterDrawerProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    brand: true,
    availability: false,
    material: false,
    'pack-size': false,
    'price-range': false,
  })

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const isActive = (groupId: string, optionId: string) => {
    return activeFilters[groupId]?.includes(optionId) || false
  }

  const activeCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-200',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className="absolute inset-0 bg-overlay" onClick={onClose} />

      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface shadow-xl transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-text">Filters</h2>
              {activeCount > 0 && (
                <p className="text-xs text-text-muted">{activeCount} active</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filterGroups.map((group) => (
              <div key={group.id} className="border-b border-border">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-text hover:bg-surface-hover transition-colors"
                >
                  {group.label}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-text-muted transition-transform duration-150',
                      expandedGroups[group.id] && 'rotate-180',
                    )}
                  />
                </button>

                {expandedGroups[group.id] && (
                  <div className="px-5 pb-3 space-y-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Checkbox
                          checked={isActive(group.id, option.id)}
                          onCheckedChange={() => onFilterChange(group.id, option.id)}
                        />
                        <span className="flex-1 text-sm text-text">{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-text-muted">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border px-5 py-4 safe-bottom space-y-2">
            <Button onClick={onApply} className="w-full">
              Show Results
            </Button>
            {activeCount > 0 && (
              <Button variant="ghost" onClick={onClearAll} className="w-full">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { FilterBar, FilterDrawer, filterGroups, sortOptions }
export type { FilterGroup, FilterOption }
