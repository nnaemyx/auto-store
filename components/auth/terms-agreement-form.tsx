"use client"
import { Button } from "@/components/ui/button"

type TermsAgreementFormProps = {
  isLoading: boolean
  onSubmit: (agreed: boolean) => void
}

export default function TermsAgreementForm({ isLoading, onSubmit }: TermsAgreementFormProps) {
  const handleAgree = () => {
    onSubmit(true)
  }

  const handleDisagree = () => {
    onSubmit(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-gray-700 space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          type="button"
          className="bg-black hover:bg-gray-800 text-white"
          onClick={handleAgree}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Agree"}
        </Button>
        <Button type="button" variant="outline" onClick={handleDisagree} disabled={isLoading}>
          Disagree
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By clicking &quot;Agree&quot;, you have acknowledged and understood our terms of agreement and privacy policy.
      </div>
    </div>
  )
}

