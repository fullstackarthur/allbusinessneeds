import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'

export interface Step {
  id: string
  label: string
  description?: string
}

interface StepProgressProps {
  steps: Step[]
  currentStep: string
  className?: string
}

function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li key={step.id} className="relative flex items-center flex-1">
              {index > 0 && (
                <div
                  className={cn(
                    'absolute left-0 right-0 top-3 h-0.5 -translate-x-1/2',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  )}
                  style={{ width: 'calc(100% - 1.5rem)', left: '50%' }}
                  aria-hidden="true"
                />
              )}

              <div className="relative flex flex-col items-center z-10 flex-1">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted && 'border-primary bg-primary',
                    isCurrent && 'border-primary bg-surface',
                    isUpcoming && 'border-border bg-surface',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isCurrent && 'text-primary',
                        isUpcoming && 'text-text-muted',
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-center hidden sm:block">
                  <p
                    className={cn(
                      'text-xs font-medium',
                      isCompleted && 'text-primary',
                      isCurrent && 'text-text',
                      isUpcoming && 'text-text-muted',
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function StepProgressMobile({ steps, currentStep, className }: StepProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)
  const current = steps[currentIndex]

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-text">
            Step {currentIndex + 1} of {steps.length}
          </p>
          <p className="text-xs text-text-muted">{current?.label}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'h-1.5 w-6 rounded-full transition-colors',
                index < currentIndex && 'bg-primary',
                index === currentIndex && 'bg-primary',
                index > currentIndex && 'bg-border',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { StepProgress, StepProgressMobile }
