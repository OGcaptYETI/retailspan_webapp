"use client";

import React, { useEffect, useState } from "react";
import pricingApi from "@/lib/supabase/pricingApi";
import { Card } from "@/app/components/molecules/cards/Card";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Table } from "@/app/components/molecules/Table";
import { Select } from "@/app/components/atoms/inputs/select";
import { Plus, Edit, Trash } from "lucide-react";
import { NewContractModal } from "../NewContractModal";
import { toast } from "react-hot-toast";

interface Contract {
  id: string;
  name: string;
  manufacturer_id: string;
  category_id: string;
  levels: { [key: string]: number };
  state_code: string;
  enhancement: string;
  status: string;
  updated_at: string;
  expires_at: string;
}

export interface ContractFormData {
  name: string;
  manufacturer_id: string;
  category_id: string;
  levels: { [key: string]: number };
  enhancement: string;
  status: string;
  expires_at: string;
  state_code?: string;
}

export default function Contracts() {
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [states, setStates] = useState<{ state_code: string; state_name: string }[]>([]);
  const [manufacturers, setManufacturers] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contractsData, statesData, manufacturersData, categoriesData] = await Promise.all([
          pricingApi.getContracts(),
          pricingApi.getStates(),
          pricingApi.getManufacturers(),
          pricingApi.getProductCategories(),
        ]);

        const completeContractsData = (contractsData as Contract[]).map((contract) => ({
          ...contract,
          state_code: contract.state_code || '',
        }));

        setContracts(completeContractsData);
        setFilteredContracts(completeContractsData);
        setStates(statesData);
        setManufacturers(manufacturersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load contracts data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...contracts];

    if (selectedStates.length > 0) {
      filtered = filtered.filter(contract => selectedStates.includes(contract.state_code));
    }

    if (selectedManufacturers.length > 0) {
      filtered = filtered.filter(contract => selectedManufacturers.includes(contract.manufacturer_id));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(contract => selectedCategories.includes(contract.category_id));
    }

    setFilteredContracts(filtered);
  }, [selectedStates, selectedManufacturers, selectedCategories, contracts]);

  const handleDelete = async (contractId: string) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await pricingApi.deleteContract(contractId);
        setContracts(contracts.filter(c => c.id !== contractId));
        setFilteredContracts(filteredContracts.filter(c => c.id !== contractId));
        toast.success("Contract deleted successfully");
      } catch (error) {
        console.error("Error deleting contract:", error);
        toast.error("Failed to delete contract");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contract Management</h1>
        <Button onClick={() => setIsNewContractModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* 🔹 Filters Section */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Select
            label="Filter by State"
            value={selectedStates}
            onChange={(e) => setSelectedStates(Array.from(e.target.selectedOptions, option => option.value))}
            options={states.map(state => ({ value: state.state_code, label: state.state_name }))}
          />
          <Select
            label="Filter by Manufacturer"
            value={selectedManufacturers}
            onChange={(e) => setSelectedManufacturers(Array.from(e.target.selectedOptions, option => option.value))}
            options={manufacturers.map(mfg => ({ value: mfg.id, label: mfg.name }))}
          />
          <Select
            label="Filter by Category"
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
          />
        </div>
      </Card>

      {/* 🔹 Contracts Table */}
      <Card className="p-6">
        {loading ? (
          <p>Loading contracts...</p>
        ) : (
          <Table
            data={filteredContracts.map(contract => ({ ...contract })) as Record<string, unknown>[]}
            columns={[
              { key: "name", label: "Contract Name" },
              { key: "status", label: "Status" },
              {
                key: "manufacturer",
                label: "Manufacturer",
                render: (_: unknown, row: Record<string, unknown>) => {
                  const contract = row as unknown as Contract;
                  return manufacturers.find(m => m.id === contract.manufacturer_id)?.name || "N/A";
                }
              },
              {
                key: "category",
                label: "Category",
                render: (_: unknown, row: Record<string, unknown>) => {
                  const contract = row as unknown as Contract;
                  return categories.find(c => c.id === contract.category_id)?.name || "N/A";
                }
              },
              { key: "updated_at", label: "Last Updated" },
              { key: "expires_at", label: "Expiration Date" },
              {
                key: "actions",
                label: "Actions",
                render: (_: unknown, row: Record<string, unknown>) => {
                  const contract = row as unknown as Contract;
                  return (
                    <div className="flex space-x-2">
                      <Button onClick={() => console.log("Edit contract", contract.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(contract.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                }
              }
            ]}
            searchPlaceholder="Search contracts..."
          />
        )}
      </Card>

      {/* 🔹 New Contract Modal */}
      <NewContractModal
        isOpen={isNewContractModalOpen}
        onClose={() => setIsNewContractModalOpen(false)}
        onSubmit={async (newContract: ContractFormData) => {
          try {
            const contractToSave = {
              ...newContract,
              id: crypto.randomUUID(),
              updated_at: new Date().toISOString(),
              levels: JSON.stringify(newContract.levels)
            };
            const savedContract = await pricingApi.addContract(contractToSave);
            setContracts([...contracts, savedContract[0]]);
            setFilteredContracts([...filteredContracts, savedContract[0]]);
            toast.success("New contract added successfully!");
          } catch (error) {
            console.error("Error creating contract:", error);
            toast.error("Failed to create contract");
          }
        }}
      />
    </div>
  );
}
