import { RegisterPage } from "@/app/components/templates/pages"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - RetailSpan",
  description: "Create a new RetailSpan account",
}

export default function Page() {
  return <RegisterPage />
}