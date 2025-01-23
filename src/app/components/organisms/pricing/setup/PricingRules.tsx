"use client"

import React, { useState, useEffect } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/molecules/cards'
import { Button } from '@/app/components/atoms/buttons'
import { Input } from '@/app/components/atoms/inputs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { toast } from 'sonner'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { useUser } from '@/lib/auth/utils'

export interface PricingRule {
  id?: string;
  organizationId: string;
  name?: string;
  description?: string;
  type: 'markup' | 'discount' | 'fixed';
  value: number;
  conditions?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  created_at?: string;
  updated_at?: string;
}

interface PricingRulesProps {
  organizationId?: string // Make optional since we'll get from user context if not provided
}

export function PricingRules({ organizationId }: PricingRulesProps) {
  const { user } = useUser()
  const [rules, setRules] = useState<PricingRule[]>([])
  const [currentRule, setCurrentRule] = useState<Partial<PricingRule>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientSupabaseClient()

  // Use provided organizationId or fall back to user's organization
  const effectiveOrgId = organizationId || user?.organizationId

  useEffect(() => {
    if (effectiveOrgId) {
      fetchRules()
    }
  }, [effectiveOrgId])

  const fetchRules = async () => {
    if (!effectiveOrgId) {
      toast.error("No organization ID available")
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('organization_id', effectiveOrgId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      console.error('Error fetching rules:', error)
      toast.error('Failed to fetch pricing rules')
    } finally {
      setIsLoading(false)
    }
  }
  const handleSaveRule = async () => {
    if (!effectiveOrgId) {
      toast.error("No organization ID available");
      return;
    }
  
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pricing_rules')
        .upsert({
          ...currentRule,
          organizationId: effectiveOrgId,
          id: currentRule.id || undefined, // Use undefined instead of empty string
        } satisfies Partial<PricingRule>)
        .select(); // Add select() to get the returned data
  
      if (error) throw error;
  
      // Type assertion for data
      const typedData = data as PricingRule[];
  
      setRules(prev => {
        if (typedData && typedData.length > 0) {
          const newRule = typedData[0];
          const existingRuleIndex = prev.findIndex(r => r.id === newRule.id);
          
          if (existingRuleIndex > -1) {
            return prev.map((rule, index) => 
              index === existingRuleIndex ? newRule : rule
            );
          }
          return [newRule, ...prev];
        }
        return prev;
      });
  
      toast.success('Rule saved successfully');
      setCurrentRule({});
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save rule');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteRule = async (ruleId: string) => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('pricing_rules')
        .delete()
        .eq('id', ruleId)

      if (error) throw error

      setRules(prev => prev.filter(r => r.id !== ruleId))
      toast.success('Rule deleted successfully')
    } catch (error) {
      toast.error('Failed to delete rule')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pricing Rules</span>
          <Button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="space-y-4 mb-6 p-4 border rounded-lg">
            <Input
              value={currentRule.name || ''}
              onChange={e => setCurrentRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name"
            />
            <Select
              value={currentRule.type}
              onValueChange={value => setCurrentRule(prev => ({ ...prev, type: value as PricingRule['type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markup">Markup</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={currentRule.value || ''}
              onChange={e => setCurrentRule(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
              placeholder="Enter value"
            />
            <div className="flex gap-4">
              <Input
                type="date"
                value={currentRule.startDate || ''}
                onChange={e => setCurrentRule(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <Input
                type="date"
                value={currentRule.endDate || ''}
                onChange={e => setCurrentRule(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentRule({})
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRule}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Rule'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{rule.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {rule.type} - {rule.value}%
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentRule(rule)
                    setIsEditing(true)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => rule.id && handleDeleteRule(rule.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingRules