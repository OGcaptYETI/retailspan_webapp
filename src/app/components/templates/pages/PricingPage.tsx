"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { type Product, type BaseProduct, type ComparableProduct } from "@/types/models/products";
import {  } from "@/types/models/pricing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Settings2, Calculator, Table } from "lucide-react";
import { useUser } from "@/lib/auth/utils";
import { supabase } from "@/lib/supabase/client";

// Dynamic imports for Pricing components
import dynamic from "next/dynamic";
const PricingCalculator = dynamic(() => import("@/app/components/organisms/pricing/PricingCalculator").then((mod) => mod.PricingCalculator));
const MarginAnalysis = dynamic(() => import("@/app/components/organisms/pricing/MarginAnalysis").then((mod) => mod.MarginAnalysis));
const StateSelector = dynamic(() => import("@/app/components/organisms/pricing/StateSelector").then((mod) => mod.StateSelector));
const ProgramEnrollment = dynamic(() => import("@/app/components/organisms/pricing/ProgramEnrollment").then((mod) => mod.ProgramEnrollment));
const DataUploader = dynamic(() => import("@/app/components/organisms/pricing/setup/DataUploader").then((mod) => mod.DataUploader));
const BrandComparison = dynamic(() => import("@/app/components/organisms/pricing/setup/BrandComparision").then((mod) => mod.BrandComparison));
const PricingRules = dynamic(() => import("@/app/components/organisms/pricing/setup/PricingRules").then((mod) => mod.PricingRules));


interface PricingPageProps {
  initialProducts?: Product[];  // Make optional since we're using state
  title: string;
}

const PricingPage: React.FC<PricingPageProps> = ({ initialProducts = [], title }) => {
  const { toast } = useToast();
  const { user, isAdmin } = useUser();
  
  // State declarations with consistent naming
  const [selectedState, setSelectedState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [products, setProducts] = useState<Product[]>(initialProducts.map(product => ({
      ...product,
      manufacturerId: (product as BaseProduct)||undefined as unknown as string, // Type assertion for demonstration""
    })));
  const [comparableProducts, setComparableProducts] = useState<Record<string, ComparableProduct[]>>({});
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    // Add product and manufacturer selectors
    const renderCalculator = () => {
      if (!user?.organizationId || !selectedProduct || !selectedManufacturer) {
        return (
          <div className="text-muted-foreground p-4">
            Please select all required fields to use the calculator
          </div>
        );
      }
      return <PricingCalculator 
        selectedState={selectedState}
        productId={selectedProduct}
        organizationId={user.organizationId}
        manufacturerId={selectedManufacturer}
        stateCode={selectedState}
      />;
    };
  

  // Check user session
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          window.location.href = "/auth/login";
          return;
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [user]);

  // Handle file uploads
  const handleUploadComplete = async (data: any[], type: string) => {
    try {
      const { error } = await supabase.from(type).insert(data);
      if (error) throw error;

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${data.length} records.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? "Pricing Administration" : "Pricing Management"}
      </h1>

      {isAdmin ? (
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList>
            <TabsTrigger value="setup">
              <Settings2 className="w-4 h-4 mr-2" />
              Price Setup
            </TabsTrigger>
            <TabsTrigger value="brands">
              <Table className="w-4 h-4 mr-2" />
              Brand Comparison
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Calculator className="w-4 h-4 mr-2" />
              Pricing Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <DataUploader
              templateType="manufacturer_pricing"
              onUploadComplete={(data) => handleUploadComplete(data, "manufacturer_pricing")}
            />
            <DataUploader
              templateType="state_pricing"
              onUploadComplete={(data) => handleUploadComplete(data, "state_pricing")}
            />
            <DataUploader
              templateType="promotions"
              onUploadComplete={(data) => handleUploadComplete(data, "promotions")}
            />
          </TabsContent>

          <TabsContent value="brands">
            <BrandComparison />
          </TabsContent>

          <TabsContent value="rules">
            <PricingRules />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="container mx-auto py-6">
          <StateSelector value={selectedState} onChange={setSelectedState} />
          {user?.organizationId ? (
          <ProgramEnrollment organizationId={user.organizationId} />
          ) : (
            <div className="text-muted-foreground">
              No organization associated with your account
            </div>
          )}
          <Tabs defaultValue="calculator">
            <TabsList>
              <TabsTrigger value="calculator">
                <Calculator className="w-4 h-4 mr-2" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Table className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator">
         <PricingCalculator 
            selectedState={selectedState}
            productId={selectedProduct}
            organizationId={user?.organizationId || ''}
            manufacturerId={selectedManufacturer || ''}
            stateCode={selectedState} // Assuming stateCode is same as selectedState
            />
             </TabsContent>

            <TabsContent value="analysis">
             <MarginAnalysis 
               products={products}
               pricingData={[]} // Replace with actual pricing data
               comparableProducts={comparableProducts} // Replace with actual comparable products
             />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default PricingPage;

