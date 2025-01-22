"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heading, Text } from "@/app/components/atoms/typography"
import { Button } from "@/app/components/atoms/buttons"
import { FormField } from "@/app/components/molecules/forms"
import { cn } from "@/lib/utils/cn"
import { toast } from "sonner"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export interface RegisterPageProps {
  className?: string
}

export function RegisterPage({ className }: RegisterPageProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < passwordRequirements.minLength) {
      errors.push(`Password must be at least ${passwordRequirements.minLength} characters long`)
    }
    if (!passwordRequirements.hasUpperCase.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!passwordRequirements.hasLowerCase.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!passwordRequirements.hasNumber.test(password)) {
      errors.push("Password must contain at least one number")
    }
    if (!passwordRequirements.hasSpecialChar.test(password)) {
      errors.push("Password must contain at least one special character")
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validate password requirements
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0])
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      toast.success("Account created successfully! Please check your email to verify your account.")
      router.push('/auth/verify-email')
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0
    const errors = validatePassword(password)
    return Math.max(0, 100 - (errors.length * 20)) // 20% per requirement
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    const strength = getPasswordStrength(password)
    
    // Update password strength indicator visually
    const strengthClass = 
      strength >= 80 ? "bg-success" :
      strength >= 60 ? "bg-warning" :
      "bg-destructive"

    // You can add visual feedback here if needed
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 text-center">
        <Heading level={1}>Create an account</Heading>
        <Text className="text-muted-foreground">
          Enter your email below to create your account
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          autoFocus
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          required
          autoComplete="new-password"
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
          minLength={8}
          onChange={handlePasswordChange}
        />

        <FormField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          required
          autoComplete="new-password"
        />

        {error && (
          <Text className="text-sm text-destructive">
            {error}
          </Text>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center">
        <Link 
          href="/auth/login"
          className="text-sm text-primary hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </div>

      <Text className="text-xs text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </Text>
    </div>
  )
}