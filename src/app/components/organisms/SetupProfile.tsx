"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { FormField } from "@/app/components/molecules/forms/FormField";
import { Button } from "@/app/components/atoms/buttons/Button";
import { toast } from "sonner";

const SetupProfileForm = () => {
  const router = useRouter();
  const supabase = createClientSupabaseClient(); // Use the client function
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    businessType: "",
    locations: 0,
    annualRevenue: 0,
    productCategories: "",
    timezone: "",
    currency: "",
    emailNotifications: false,
    smsAlerts: false,
    pushNotifications: false,
    tagLine: "",
    socialLinks: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError) {
        console.error("User fetch error:", JSON.stringify(userError, null, 2));
        throw userError;
      }
  
      if (!user) throw new Error("No user found");
  
      // Insert into organizations
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: formData.companyName,
          subscription_status: "trial",
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          settings: {
            timezone: formData.timezone || "UTC",
            currency: formData.currency || "USD",
            business_type: formData.businessType || "retail",
            locations: Number(formData.locations) || 1,
            annual_revenue: Number(formData.annualRevenue) || 0,
            product_categories: formData.productCategories || [],
          },
        })
        .select("id")
        .single();
  
      if (orgError) {
        console.error("Organization creation error:", JSON.stringify(orgError, null, 2));
        throw orgError;
      }
  
      if (!orgData?.id) {
        console.error("Organization creation failed: No ID returned");
        throw new Error("Organization creation failed");
      }
  
      // Insert into user_profiles
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          organization_id: orgData.id,
          role: "admin",
          settings: {
            name: formData.name || user.email?.split("@")[0],
            email: formData.email || user.email,
            phone: formData.phone || "",
            tag_line: formData.tagLine || "",
            social_links: formData.socialLinks || "",
            email_notifications: Boolean(formData.emailNotifications),
            sms_alerts: Boolean(formData.smsAlerts),
            push_notifications: Boolean(formData.pushNotifications),
          },
          permissions: ["admin"],
        });
  
      if (profileError) {
        console.error("Profile creation error:", JSON.stringify(profileError, null, 2));
        throw profileError;
      }
  
      toast.success("Profile setup complete!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error setting up profile:", JSON.stringify(error, null, 2));
      toast.error("Failed to setup profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
        <FormField label="Email" name="email" value={formData.email} onChange={handleInputChange} required type="email" />
      </div>
      {/* Additional fields here */}
      <div className="flex justify-between pt-6">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Setting up profile..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
};

export default SetupProfileForm;


