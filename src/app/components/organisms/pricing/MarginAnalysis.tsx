import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/molecules/cards/Card';
import { Input } from '@/app/components/atoms/inputs/Input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  sku: string;
  manufacturerId: string;
  category: string;
  price: number;
  // ... other product properties
}

export interface PricingData {
  wholesale_cost: number;
  retail_price: number;
  competitor_price?: number;
  margin_percent: number;
  markup_percent: number;
  penny_profit: number;
  id: string;
  product_id: string;
  pricingData: any;
  comparableProducts: ComparableProduct[];
}

export interface ComparableProduct {
  id: bigint;
  name: string;
  retail_price: number;
}

export interface MarginAnalysisProps {
  products: Product[];
  pricingData: Record<string, PricingData>;
  comparableProducts: Record<string, ComparableProduct[]>;
  onUpdateWholesale?: (productId: string, newCost: number) => void;
}

export const MarginAnalysis: React.FC<MarginAnalysisProps> = ({
  products,
  pricingData,
  comparableProducts,
  onUpdateWholesale
}) => {
  // State for sorting and filtering
  const [sortField, setSortField] = useState<keyof PricingData>('margin_percent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');
  const [editingWholesale, setEditingWholesale] = useState<string | null>(null);

  // Sort products based on current sort field and direction
  const sortedProducts = [...products].sort((a, b) => {
    const aValue = pricingData[a.id.toString()]?.[sortField] ?? 0;
    const bValue = pricingData[b.id.toString()]?.[sortField] ?? 0;
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Filter products based on search input
  const filteredProducts = sortedProducts.filter(product => 
    product.name.toLowerCase().includes(filter.toLowerCase()) ||
    product.sku.toLowerCase().includes(filter.toLowerCase())
  );

  // Helper function to handle sort column clicks
  const handleSort = (field: keyof PricingData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Helper function to compare with competitor prices
  const getCompetitorComparison = (productId: string, value: number) => {
    const competitors = comparableProducts[productId];
    if (!competitors?.length) return null;

    const avgCompetitorPrice = competitors.reduce((sum, comp) => 
      sum + comp.retail_price, 0) / competitors.length;

    const diff = value - avgCompetitorPrice;
    if (Math.abs(diff) < 0.01) return <Minus className="h-4 w-4 text-gray-400" />;
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  // Formatting helpers
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat('en-US', { 
      style: 'percent', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value / 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Margin Analysis</CardTitle>
          <Input
            placeholder="Filter by name or SKU..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Wholesale
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleSort('wholesale_cost')}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Retail
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleSort('retail_price')}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Margin %
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleSort('margin_percent')}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Markup %
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleSort('markup_percent')}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  Penny Profit
                  <ArrowUpDown 
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleSort('penny_profit')}
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">Vs. Competition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => {
              const pricing = pricingData[product.id.toString()];
              if (!pricing) return null;

              return (
                <TableRow key={product.id.toString()}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">
                    {editingWholesale === product.id.toString() ? (
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={pricing.wholesale_cost}
                        className="w-24 text-right"
                        onBlur={(e) => {
                          const newValue = parseFloat(e.target.value);
                          if (!isNaN(newValue) && onUpdateWholesale) {
                            onUpdateWholesale(product.id.toString(), newValue);
                          }
                          setEditingWholesale(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingWholesale(product.id.toString())}
                      >
                        {formatCurrency(pricing.wholesale_cost)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(pricing.retail_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(pricing.margin_percent)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(pricing.markup_percent)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(pricing.penny_profit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getCompetitorComparison(product.id.toString(), pricing.retail_price)}
                      {comparableProducts[product.id.toString()]?.map(comp => (
                        <span key={comp.id.toString()} className="text-xs text-gray-500">
                          {comp.name}: {formatCurrency(comp.retail_price)}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MarginAnalysis;