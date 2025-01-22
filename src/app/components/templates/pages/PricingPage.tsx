// app/components/templates/pages/PricingPage.tsx
"use client";

import { useState, useEffect } from 'react';
import { useToast } from "@/app/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Settings2, Calculator, Table } from 'lucide-react';
import { useUser } from '@/lib/auth/utils';
import { supabase } from '@/lib/supabase/client';

// Import our pricing components
import { PricingCalculator } from '@/app/components/organisms/pricing/PricingCalculator';
import { MarginAnalysis } from '@/app/components/organisms/pricing/MarginAnalysis';
import { StateSelector } from '@/app/components/organisms/pricing/StateSelector';
import { ProgramEnrollment } from '@/app/components/organisms/pricing/ProgramEnrollment';
import { DataUploader } from '@/app/components/organisms/pricing/setup/DataUploader';
import { BrandComparison } from '@/app/components/organisms/pricing/setup/BrandComparision';
import { PricingRules } from '@/app/components/organisms/pricing/setup/PricingRules';

const AdminView = () => {
  const { toast } = useToast();

  const handleUploadComplete = async (data: any[], type: string) => {
    try {
      const { error } = await supabase.from(type).insert(data);
      if (error) throw error;
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${data.length} ${type} records`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
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
          onUploadComplete={(data) => handleUploadComplete(data, 'manufacturer_pricing')}
        />
        <DataUploader
          templateType="state_pricing"
          onUploadComplete={(data) => handleUploadComplete(data, 'state_pricing')}
        />
        <DataUploader
          templateType="promotions"
          onUploadComplete={(data) => handleUploadComplete(data, 'promotions')}
        />
      </TabsContent>

      <TabsContent value="brands">
        <BrandComparison />
      </TabsContent>

      <TabsContent value="rules">
        <PricingRules />
      </TabsContent>
    </Tabs>
  );
};

const UserView = () => {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState('');
  const [pricingData, setPricingData] = useState({});
  const [products, setProducts] = useState([]);
  const [comparableProducts, setComparableProducts] = useState({});

  useEffect(() => {
    if (selectedState) {
      loadPricingData();
    }
  }, [selectedState]);

  const loadPricingData = async () => {
    try {
      // Load products, pricing, and comparable products
      const [productsRes, pricingRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('calculated_prices')
          .select('*')
          .eq('state_code', selectedState)
      ]);

      if (productsRes.error) throw productsRes.error;
      if (pricingRes.error) throw pricingRes.error;

      setProducts(productsRes.data);
      // Transform pricing data into required format
      const pricingMap = pricingRes.data.reduce((acc, curr) => {
        acc[curr.product_id] = curr;
        return acc;
      }, {});
      setPricingData(pricingMap);

    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StateSelector
          value={selectedState}
          onChange={setSelectedState}
        />
        <ProgramEnrollment />
      </div>

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
          />
        </TabsContent>

        <TabsContent value="analysis">
          <MarginAnalysis
            products={products}
            pricingData={pricingData}
            comparableProducts={comparableProducts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const PricingPage = () => {
  const { user, isAdmin } = useUser();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isAdmin ? 'Pricing Administration' : 'Pricing Management'}
      </h1>
      {isAdmin ? <AdminView /> : <UserView />}
    </div>
  );
};