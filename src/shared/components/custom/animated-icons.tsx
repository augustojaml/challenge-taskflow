'use client'

import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  UsersIcon,
} from 'lucide-react'

const AnimatedIcons = () => {
  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="bg-primary/15 text-primary animate-float-slow flex h-10 w-10 items-center justify-center rounded-full">
        <ClipboardListIcon className="h-4 w-4" />
      </div>

      <div className="bg-chart-2/15 text-chart-2 animate-float flex h-12 w-12 items-center justify-center rounded-full">
        <CheckCircleIcon className="h-6 w-6" />
      </div>

      <div className="bg-chart-3/15 text-chart-3 animate-float-delay flex h-8 w-8 items-center justify-center rounded-full">
        <CalendarIcon className="h-4 w-4" />
      </div>

      <div className="bg-chart-1/15 text-chart-1 animate-float flex h-9 w-9 items-center justify-center rounded-full">
        <UsersIcon className="h-4 w-4" />
      </div>
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float 4.5s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 3.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

export { AnimatedIcons }
