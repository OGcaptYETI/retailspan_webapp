// File: src/app/components/templates/pages/LoginPage.tsx
import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heading, Text } from "@/app/components/atoms/typography"
import { Button } from "@/app/components/atoms/buttons"
import { FormField } from "@/app/components/molecules/forms"
import { cn } from "@/lib/utils/cn"

export interface LoginPageProps {
  className?: string
}

export function LoginPage({ className }: LoginPageProps) {
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

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2 text-center">
        <Heading level={1}>Sign in to your account</Heading>
        <Text className="text-muted-foreground">
          Enter your email below to access your account
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
          autoComplete="current-password"
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
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <Link 
          href="/auth/register"
          className="text-sm text-primary hover:underline"
        >
          Don't have an account? Sign up
        </Link>
        
        <div className="flex items-center justify-center gap-2">
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}