import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/presentation/providers/query-client'

function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export { QueryProvider }
