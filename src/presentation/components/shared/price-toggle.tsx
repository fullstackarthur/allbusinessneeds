import { useUiStore } from '@/presentation/stores/ui-store'
import { Eye, EyeOff } from 'lucide-react'

function PriceToggle() {
  const showPrices = useUiStore((s) => s.showPrices)
  const togglePrices = useUiStore((s) => s.togglePrices)

  return (
    <button
      onClick={togglePrices}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
      aria-label={showPrices ? 'Hide prices' : 'Show prices'}
      title={showPrices ? 'Hide prices' : 'Show prices'}
    >
      {showPrices ? (
        <Eye className="h-3.5 w-3.5" />
      ) : (
        <EyeOff className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">{showPrices ? 'Hide Prices' : 'Show Prices'}</span>
    </button>
  )
}

export { PriceToggle }
