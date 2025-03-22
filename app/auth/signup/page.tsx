"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SignupSteps from "@/components/auth/signup-steps";
import BasicDetailsForm from "@/components/auth/basic-details-form";
import SecuritySetupForm from "@/components/auth/security-setup-form";
import VerificationForm from "@/components/auth/verification-form";
import AdditionalDetailsForm from "@/components/auth/additional-details-form";
import TermsAgreementForm from "@/components/auth/terms-agreement-form";

export type SignupFormData = {
  fullName: string;
  email: string;
  location: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  phone: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  gender: string;
  shippingDetails: {
    state: string;
    city: string;
    phone: string;
    postalCode: string;
    address: string;
  };
  agreedToTerms: boolean;
};

const initialFormData: SignupFormData = {
  fullName: "",
  email: "",
  location: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
  phone: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: "",
  },
  gender: "",
  shippingDetails: {
    state: "",
    city: "",
    phone: "",
    postalCode: "",
    address: "",
  },
  agreedToTerms: false,
};

type SignupStep =
  | "basicDetails"
  | "securitySetup"
  | "verification"
  | "additionalDetails"
  | "termsAgreement";

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>("basicDetails");
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleBasicDetailsSubmit = (data: Partial<SignupFormData>) => {
    updateFormData(data);
    setCurrentStep("securitySetup");
  };

  const handleSecuritySetupSubmit = (data: Partial<SignupFormData>) => {
    updateFormData(data);
    setCurrentStep("verification");
  };

  const handleVerificationSubmit = (data: Partial<SignupFormData>) => {
    updateFormData(data);
    setCurrentStep("additionalDetails");
  };

  const handleAdditionalDetailsSubmit = (data: Partial<SignupFormData>) => {
    updateFormData(data);
    setCurrentStep("termsAgreement");
  };

  const handleTermsAgreementSubmit = async (agreed: boolean) => {
    setIsLoading(true);
    updateFormData({ agreedToTerms: agreed });

    try {
      // In a real app, you would call your registration API here
      // For demo purposes, we'll just simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to home page or login page after successful registration
      router.push("/auth/login?registered=true");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen mt-[52px] md:mt-0 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:py-12">
        <div className="w-full  space-y-8">
          <div className="text-center">
            {currentStep === "basicDetails" && (
              <>
                <h1 className="text-3xl font-bold">Create Your Account</h1>
                <p className="mt-2 text-gray-600">
                  Please enter the correct details to create your ecommerce
                  account
                </p>
              </>
            )}

            {currentStep === "securitySetup" && (
              <>
                <h1 className="text-3xl font-bold">Create Your Account</h1>
                <p className="mt-2 text-gray-600">
                  Please set your password to continue to your e-commerce
                  account
                </p>
              </>
            )}

            {currentStep === "verification" && (
              <>
                <h1 className="text-3xl font-bold">Create Your Account</h1>
                <p className="mt-2 text-gray-600">
                  Please set your password to continue to your e-commerce
                  account
                </p>
              </>
            )}

            {currentStep === "additionalDetails" && (
              <>
                <h1 className="text-3xl font-bold">Set Your Profile</h1>
                <p className="mt-2 text-gray-600">
                  Please enter the correct profile details as this would be used
                  to process your orders in Auto-Store
                </p>
              </>
            )}

            {currentStep === "termsAgreement" && (
              <>
                <h1 className="text-3xl font-bold">Terms of Agreement</h1>
              </>
            )}
          </div>

          <SignupSteps currentStep={currentStep} />

          {currentStep === "basicDetails" && (
            <BasicDetailsForm
              initialData={formData}
              onSubmit={handleBasicDetailsSubmit}
            />
          )}

          {currentStep === "securitySetup" && (
            <SecuritySetupForm
              initialData={formData}
              onSubmit={handleSecuritySetupSubmit}
            />
          )}

          {currentStep === "verification" && (
            <VerificationForm
              initialData={formData}
              onSubmit={handleVerificationSubmit}
            />
          )}

          {currentStep === "additionalDetails" && (
            <AdditionalDetailsForm
              initialData={formData}
              onSubmit={handleAdditionalDetailsSubmit}
            />
          )}

          {currentStep === "termsAgreement" && (
            <TermsAgreementForm
              isLoading={isLoading}
              onSubmit={handleTermsAgreementSubmit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
