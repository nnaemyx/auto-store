import { cn } from "@/lib/utils"

type Step = {
  id: string
  label: string
}

const steps: Step[] = [
  { id: "basicDetails", label: "Basic details" },
  { id: "securitySetup", label: "Security set up" },
  { id: "additionalDetails", label: "Additional details" },
]

type SignupStepsProps = {
  currentStep: string
}

export default function SignupSteps({ currentStep }: SignupStepsProps) {
  const getCurrentStepIndex = () => {
    if (currentStep === "basicDetails") return 0
    if (currentStep === "securitySetup" || currentStep === "verification") return 1
    if (currentStep === "additionalDetails") return 2
    if (currentStep === "termsAgreement") return 3
    return 0
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="md:flex md:justify-center md:items-center md:space-x-4 py-6">
      {steps.map((step, index) => (
        <div key={step.id} className="md:flex items-center justify-center">
          {index > 0 && <div className={cn("md:h-px w-8 mx-2", index <= currentStepIndex ? "bg-black" : "bg-gray-300")} />}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                currentStep === step.id
                  ? "bg-white border-2 border-black ring-4 ring-gray-100"
                  : index < currentStepIndex
                    ? "bg-black hidden md:flex"
                    : "bg-gray-300 hidden md:flex",
              )}
            />
            <span className={cn("text-xs mt-2", currentStep === step.id ? "font-medium" : "text-gray-500 hidden  md:flex")}>
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

