import * as React from 'react'

interface UseProductFiltersState {
  filters: Record<string, string[]>
  sortBy: string
  viewMode: 'grid' | 'list'
}

export function useProductFilters() {
  const [state, setState] = React.useState<UseProductFiltersState>({
    filters: {},
    sortBy: 'relevance',
    viewMode: 'grid',
  })

  const toggleFilter = React.useCallback((groupId: string, optionId: string) => {
    setState((prev) => {
      const current = prev.filters[groupId] || []
      const exists = current.includes(optionId)

      return {
        ...prev,
        filters: {
          ...prev.filters,
          [groupId]: exists
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        },
      }
    })
  }, [])

  const setSortBy = React.useCallback((sortBy: string) => {
    setState((prev) => ({ ...prev, sortBy }))
  }, [])

  const setViewMode = React.useCallback((viewMode: 'grid' | 'list') => {
    setState((prev) => ({ ...prev, viewMode }))
  }, [])

  const clearAll = React.useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }))
  }, [])

  const activeFilterCount = React.useMemo(
    () => Object.values(state.filters).reduce((sum, arr) => sum + arr.length, 0),
    [state.filters],
  )

  return {
    filters: state.filters,
    sortBy: state.sortBy,
    viewMode: state.viewMode,
    activeFilterCount,
    toggleFilter,
    setSortBy,
    setViewMode,
    clearAll,
  }
}
