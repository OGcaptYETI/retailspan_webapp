// app/pricing/Components/NewContractModal.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "@/app/components/ui/modal";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Input } from "@/app/components/atoms/inputs/Input";
import { Select } from "@/app/components/atoms/inputs/select";
import { Plus, X } from "lucide-react";
import { Card } from "@/app/components/molecules/cards/Card";
import toast from "react-hot-toast";


// Types
type ProductCategory = 'FMC' | 'MMC' | 'OND' | 'EVP';

interface ProgramLevel {
  name: string;
  discountAmount: number;
  unitType: string;
  volumeRequirement: number;
  additionalRequirements: string;
  targetMargin: number;
}

interface Enhancement {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  conditions: string;
  duration: string;
  isStackable: boolean;
  applicableProducts: string[];
}

interface ContractVariable {
  name: string;
  type: 'number' | 'percentage' | 'text' | 'formula';
  defaultValue: string;
  description: string;
  isRequired: boolean;
}

interface ContractFormData {
  name: string;
  category: ProductCategory;
  effectiveDate: string;
  expirationDate: string;
  levels: ProgramLevel[];
  enhancements: Enhancement[];
  variables: ContractVariable[];
  description: string;
  status: 'Draft' | 'Active' | 'Expired';
  manufacturer_id: string;
}

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contractData: ContractFormData) => Promise<void>;
}

export const NewContractModal: React.FC<NewContractModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [contractData, setContractData] = useState<ContractFormData>({
    name: "",
    manufacturer_id: "",
    category: 'FMC',
    levels: [],
    enhancements: [],
    variables: [],
    effectiveDate: "",
    expirationDate: "",
    status: 'Draft',
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    if (
      !contractData.manufacturer_id ||
      !contractData.category ||
      !contractData.enhancements.length ||
      !contractData.expirationDate
    ) {
      toast.error("All required fields must be filled!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(contractData);
      onClose();
    } catch (error) {
      console.error('Error submitting contract:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unit types based on category
  const getUnitTypes = (category: ProductCategory) => {
    switch (category) {
      case 'FMC':
        return 'Cartons';
      case 'MMC':
        return 'Sleeve';
      case 'OND':
        return 'Roll';
      case 'EVP':
        return 'Box';
      default:
        return '';
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Contract Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Contract Name</label>
          <Input
            value={contractData.name}
            onChange={(e) => setContractData({ ...contractData, name: e.target.value })}
            placeholder="e.g., Premium Partner Program 2024"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={contractData.category}
            onChange={(value) => setContractData({ 
              ...contractData, 
              category: value as unknown as ProductCategory,
              levels: contractData.levels.map(level => ({
                ...level,
                unitType: getUnitTypes(value as unknown as ProductCategory)
              }))
            })}
            options={[
              { value: 'FMC', label: 'Factory Made Cigarettes' },
              { value: 'MMC', label: 'Mass Market Cigars' },
              { value: 'OND', label: 'Oral Nicotine Delivery' },
              { value: 'EVP', label: 'Electronic Vapor Products' }
            ]}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select
            value={contractData.status}
            onChange={(value) => setContractData({ 
              ...contractData, 
              status: value as unknown as 'Draft' | 'Active' | 'Expired'

            })}
            options={[
              { value: 'Draft', label: 'Draft' },
              { value: 'Active', label: 'Active' },
              { value: 'Expired', label: 'Expired' }
            ]}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Effective Date</label>
          <Input
            type="date"
            value={contractData.effectiveDate}
            onChange={(e) => setContractData({ ...contractData, effectiveDate: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Expiration Date</label>
          <Input
            type="date"
            value={contractData.expirationDate}
            onChange={(e) => setContractData({ ...contractData, expirationDate: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea
            value={contractData.description}
            onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
            className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background"
            placeholder="Enter contract description..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Program Levels</h3>
        <Button variant="outline" size="sm" onClick={() => {
          setContractData({
            ...contractData,
            levels: [...contractData.levels, {
              name: "",
              discountAmount: 0,
              unitType: getUnitTypes(contractData.category),
              volumeRequirement: 0,
              additionalRequirements: "",
              targetMargin: 0
            }]
          });
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Level
        </Button>
      </div>

      {contractData.levels.map((level, index) => (
        <Card key={index} className="p-4 relative">
          <div className="absolute right-2 top-2">
            {contractData.levels.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newLevels = contractData.levels.filter((_, i) => i !== index);
                  setContractData({ ...contractData, levels: newLevels });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Level Name</label>
              <Input
                value={level.name}
                onChange={(e) => {
                  const newLevels = [...contractData.levels];
                  newLevels[index].name = e.target.value;
                  setContractData({ ...contractData, levels: newLevels });
                }}
                placeholder="e.g., Gold, Silver, Bronze"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Discount Amount ($ per {level.unitType})
              </label>
              <Input
                type="number"
                value={level.discountAmount}
                onChange={(e) => {
                  const newLevels = [...contractData.levels];
                  newLevels[index].discountAmount = parseFloat(e.target.value);
                  setContractData({ ...contractData, levels: newLevels });
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Volume Requirement ({level.unitType}/month)
              </label>
              <Input
                type="number"
                value={level.volumeRequirement}
                onChange={(e) => {
                  const newLevels = [...contractData.levels];
                  newLevels[index].volumeRequirement = parseInt(e.target.value);
                  setContractData({ ...contractData, levels: newLevels });
                }}
                placeholder="Minimum volume required"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Target Margin (%)</label>
              <Input
                type="number"
                value={level.targetMargin}
                onChange={(e) => {
                  const newLevels = [...contractData.levels];
                  newLevels[index].targetMargin = parseFloat(e.target.value);
                  setContractData({ ...contractData, levels: newLevels });
                }}
                placeholder="Target margin percentage"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Additional Requirements</label>
              <textarea
                value={level.additionalRequirements}
                onChange={(e) => {
                  const newLevels = [...contractData.levels];
                  newLevels[index].additionalRequirements = e.target.value;
                  setContractData({ ...contractData, levels: newLevels });
                }}
                className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Enter any additional requirements or terms..."
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Enhancements</h3>
        <Button variant="outline" size="sm" onClick={() => {
          setContractData({
            ...contractData,
            enhancements: [...contractData.enhancements, {
              name: "",
              type: 'fixed',
              value: 0,
              conditions: "",
              duration: "",
              isStackable: false,
              applicableProducts: []
            }]
          });
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Enhancement
        </Button>
      </div>

      {contractData.enhancements.map((enhancement, index) => (
        <Card key={index} className="p-4 relative">
          <div className="absolute right-2 top-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newEnhancements = contractData.enhancements.filter((_, i) => i !== index);
                setContractData({ ...contractData, enhancements: newEnhancements });
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Enhancement Name</label>
              <Input
                value={enhancement.name}
                onChange={(e) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].name = e.target.value;
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                placeholder="e.g., Volume Bonus, Seasonal Discount"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select
                value={enhancement.type}
                onChange={(value) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].type = value as unknown as 'percentage' | 'fixed';
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                options={[
                  { value: 'fixed', label: 'Fixed Amount' },
                  { value: 'percentage', label: 'Percentage' }
                ]}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Value {enhancement.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <Input
                type="number"
                value={enhancement.value}
                onChange={(e) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].value = parseFloat(e.target.value);
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                placeholder="Enter value"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Duration</label>
              <Input
                value={enhancement.duration}
                onChange={(e) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].duration = e.target.value;
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                placeholder="e.g., 3 months, 1 year"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Conditions</label>
              <textarea
                value={enhancement.conditions}
                onChange={(e) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].conditions = e.target.value;
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background"
                placeholder="Enter conditions and requirements..."
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enhancement.isStackable}
                onChange={(e) => {
                  const newEnhancements = [...contractData.enhancements];
                  newEnhancements[index].isStackable = e.target.checked;
                  setContractData({ ...contractData, enhancements: newEnhancements });
                }}
                className="rounded border-input"
                title="Stackable with other enhancements"
              />
              <label className="text-sm">Stackable with other enhancements</label>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contract Variables</h3>
        <Button variant="outline" size="sm" onClick={() => {
          setContractData({
            ...contractData,
            variables: [...contractData.variables, {
              name: "",
              type: "number",
              defaultValue: "",
              description: "",
              isRequired: true
            }]
          });
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variable
        </Button>
      </div>

      {contractData.variables.map((variable, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Variable Name"
              value={variable.name}
              onChange={(e) => {
                const newVars = [...contractData.variables];
                newVars[index].name = e.target.value;
                setContractData({ ...contractData, variables: newVars });
              }}
            />
            <Select
              label="Type"
              value={variable.type}
              onChange={(value) => {
                const newVars = [...contractData.variables];
                newVars[index].type = value as unknown as 'number' | 'percentage' | 'text' | 'formula';
                setContractData({ ...contractData, variables: newVars });
              }}
              options={[
                { value: 'number', label: 'Number' },
                { value: 'percentage', label: 'Percentage' },
                { value: 'text', label: 'Text' },
                { value: 'formula', label: 'Formula' }
              ]}
            />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">New Contract</h2>
          <div className="text-sm text-muted-foreground">Step {step} of 4</div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button 
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Contract'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
