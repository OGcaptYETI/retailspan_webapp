// app/components/organisms/pricing/setup/BrandComparison.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/molecules/cards/Card';
import { Button } from '@/app/components/atoms/buttons/Button';
import { Input } from '@/app/components/atoms/inputs/Input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { useToast } from '@/app/components/ui/use-toast';
import { supabase } from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Trash2, Plus } from 'lucide-react';

interface Product {
  id: bigint;
  name: string;
  sku: string;
  manufacturer_id: string;
  category: string;
}

interface Manufacturer {
  id: string;
  name: string;
  code: string;
}

interface ComparisonMapping {
  id: string;
  primary_product_id: bigint;
  comparable_product_id: bigint;
  comparison_type: 'direct' | 'premium' | 'value';
  priority: number;
}

export const BrandComparison: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [mappings, setMappings] = useState<ComparisonMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<bigint | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [addingComparison, setAddingComparison] = useState(false);
  const [newComparison, setNewComparison] = useState({
    comparableProduct: null as bigint | null,
    type: 'direct' as 'direct' | 'premium' | 'value',
    priority: 1
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, manufacturersRes, mappingsRes] = await Promise.all([
          supabase.from('products').select('*').order('name'),
          supabase.from('manufacturers').select('*').order('name'),
          supabase.from('product_comparisons').select('*')
        ]);

        if (productsRes.error) throw productsRes.error;
        if (manufacturersRes.error) throw manufacturersRes.error;
        if (mappingsRes.error) throw mappingsRes.error;

        setProducts(productsRes.data);
        setManufacturers(manufacturersRes.data);
        setMappings(mappingsRes.data);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: (error as Error).message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products by manufacturer
  const filteredProducts = selectedManufacturer
    ? products.filter(p => p.manufacturer_id === selectedManufacturer)
    : products;

  // Get comparable products (excluding current product and its existing comparisons)
  const getComparableProducts = () => {
    if (!selectedProduct) return [];
    
    const existingComparisons = mappings
      .filter(m => m.primary_product_id === selectedProduct)
      .map(m => m.comparable_product_id);

    return products.filter(p => 
      p.id !== selectedProduct && 
      !existingComparisons.includes(p.id)
    );
  };

  // Add new comparison mapping
  const handleAddComparison = async () => {
    if (!selectedProduct || !newComparison.comparableProduct) return;

    try {
      const { data, error } = await supabase
        .from('product_comparisons')
        .insert([{
          primary_product_id: selectedProduct,
          comparable_product_id: newComparison.comparableProduct,
          comparison_type: newComparison.type,
          priority: newComparison.priority
        }])
        .select()
        .single();

      if (error) throw error;

      setMappings(prev => [...prev, data]);
      setAddingComparison(false);
      setNewComparison({
        comparableProduct: null,
        type: 'direct',
        priority: 1
      });

      toast({
        title: "Comparison added",
        description: "Product comparison mapping has been saved",
      });
    } catch (error) {
      toast({
        title: "Error adding comparison",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Remove comparison mapping
  const handleRemoveComparison = async (mappingId: string) => {
    try {
      const { error } = await supabase
        .from('product_comparisons')
        .delete()
        .eq('id', mappingId);

      if (error) throw error;

      setMappings(prev => prev.filter(m => m.id !== mappingId));
      toast({
        title: "Comparison removed",
        description: "Product comparison mapping has been removed",
      });
    } catch (error) {
      toast({
        title: "Error removing comparison",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Update comparison priority
  const handleUpdatePriority = async (mappingId: string, newPriority: number) => {
    try {
      const { error } = await supabase
        .from('product_comparisons')
        .update({ priority: newPriority })
        .eq('id', mappingId);

      if (error) throw error;

      setMappings(prev => prev.map(m => 
        m.id === mappingId ? { ...m, priority: newPriority } : m
      ));
    } catch (error) {
      toast({
        title: "Error updating priority",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading comparison data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Comparison Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Manufacturer Selection */}
          <div className="space-y-2">
            <label className="font-medium">Manufacturer</label>
            <Select
              value={selectedManufacturer || ''}
              onValueChange={setSelectedManufacturer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer..." />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map(mfr => (
                  <SelectItem key={mfr.id} value={mfr.id}>
                    {mfr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="font-medium">Product</label>
            <Select
              value={selectedProduct?.toString() || ''}
              onValueChange={val => setSelectedProduct(BigInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product..." />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map(product => (
                  <SelectItem key={product.id.toString()} value={product.id.toString()}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <>
              {/* Existing Comparisons */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparable Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings
                    .filter(m => m.primary_product_id === selectedProduct)
                    .sort((a, b) => a.priority - b.priority)
                    .map(mapping => {
                      const comparableProduct = products.find(p => p.id === mapping.comparable_product_id);
                      
                      return (
                        <TableRow key={mapping.id}>
                          <TableCell>
                            {comparableProduct?.name} ({comparableProduct?.sku})
                          </TableCell>
                          <TableCell className="capitalize">
                            {mapping.comparison_type}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="1"
                                value={mapping.priority}
                                onChange={(e) => handleUpdatePriority(mapping.id, parseInt(e.target.value))}
                                className="w-20"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveComparison(mapping.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              {/* Add New Comparison */}
              <div className="space-y-4">
                <Button
                  onClick={() => setAddingComparison(true)}
                  disabled={addingComparison}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comparison
                </Button>

                {addingComparison && (
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="font-medium">Comparable Product</label>
                        <Select
                          value={newComparison.comparableProduct?.toString() || ''}
                          onValueChange={val => setNewComparison(prev => ({
                            ...prev,
                            comparableProduct: BigInt(val)
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select comparable product..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getComparableProducts().map(product => (
                              <SelectItem 
                                key={product.id.toString()} 
                                value={product.id.toString()}
                              >
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="font-medium">Comparison Type</label>
                        <Select
                          value={newComparison.type}
                          onValueChange={val => setNewComparison(prev => ({
                            ...prev,
                            type: val as typeof newComparison.type
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="direct">Direct</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="value">Value</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="font-medium">Priority</label>
                        <Input
                          type="number"
                          min="1"
                          value={newComparison.priority}
                          onChange={e => setNewComparison(prev => ({
                            ...prev,
                            priority: parseInt(e.target.value)
                          }))}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleAddComparison}>
                          Save Comparison
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setAddingComparison(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};