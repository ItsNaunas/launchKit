'use client';

import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="w-full py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    ${step.completed
                      ? 'bg-green-600 text-white'
                      : step.current
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                {/* Label */}
                <div className="absolute top-12 text-center w-32">
                  <p
                    className={`text-xs font-medium ${
                      step.current ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

