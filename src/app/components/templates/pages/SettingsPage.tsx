// File: src/app/components/templates/pages/SettingsPage.tsx
import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  PageTemplate, 
  type PageTemplateProps 
} from "./PageTemplate"
import { Button } from "@/app/components/atoms/buttons"
import { FormField } from "@/app/components/molecules/forms"
import { Text } from "@/app/components/atoms/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/molecules/cards"
import { cn } from "@/lib/utils/cn"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role?: string
}

export interface SettingsPageProps extends Omit<PageTemplateProps, 'children'> {
  initialProfile?: UserProfile
  className?: string
}

export function SettingsPage({
  initialProfile,
  className,
  ...pageProps
}: SettingsPageProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const updates = {
      full_name: formData.get("fullName") as string,
      company_name: formData.get("companyName") as string,
      role: formData.get("role") as string,
      updated_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', initialProfile?.id)

      if (error) throw error

      setSuccessMessage('Profile updated successfully')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccessMessage('Password updated successfully')
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTemplate
      {...pageProps}
    >
      <div className={cn("space-y-6", className)}>
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <FormField
                label="Email"
                type="email"
                value={initialProfile?.email}
                disabled
                helperText="Email cannot be changed"
              />

              <FormField
                label="Full Name"
                name="fullName"
                defaultValue={initialProfile?.full_name}
                placeholder="John Doe"
              />

              <FormField
                label="Company Name"
                name="companyName"
                defaultValue={initialProfile?.company_name}
                placeholder="Acme Inc."
              />

              <FormField
                label="Role"
                name="role"
                defaultValue={initialProfile?.role}
                placeholder="Store Manager"
              />

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Update */}
        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <FormField
                label="New Password"
                type="password"
                name="newPassword"
                required
                minLength={8}
                helperText="Must be at least 8 characters"
              />

              <FormField
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                required
                minLength={8}
              />

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Text className="text-sm text-destructive">
            {error}
          </Text>
        )}

        {successMessage && (
          <Text className="text-sm text-green-600">
            {successMessage}
          </Text>
        )}
      </div>
    </PageTemplate>
  )
}