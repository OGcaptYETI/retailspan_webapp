// File: src/app/components/templates/pages/RegisterPage.tsx
import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heading, Text } from "@/app/components/atoms/typography"
import { Button } from "@/app/components/atoms/buttons"
import { FormField } from "@/app/components/molecules/forms"
import { cn } from "@/lib/utils/cn"

export interface RegisterPageProps {
  className?: string
}

export function RegisterPage({ className }: RegisterPageProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      router.push('/auth/verify-email')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
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
          helperText="Must be at least 8 characters"
          minLength={8}
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