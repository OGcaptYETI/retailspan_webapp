// app/components/organisms/pricing/ProgramEnrollment.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/molecules/cards/Card';
import { Label } from '@/app/components/atoms/typography/Label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/atoms/buttons/Button';
import { useToast } from '@/app/components/ui/use-toast';
import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

interface Program {
  id: string;
  name: string;
  manufacturer_id: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

interface ProgramEnrollmentProps {
  organizationId: string;
  onEnrollmentChange?: (programs: string[]) => void;
}

export const ProgramEnrollment: React.FC<ProgramEnrollmentProps> = ({
  organizationId,
  onEnrollmentChange
}) => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available programs and current enrollments
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all available programs
        const { data: programsData, error: programsError } = await supabase
          .from('manufacturer_programs')
          .select('*')
          .eq('active', true);

        if (programsError) throw programsError;

        // Fetch current enrollments
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('program_enrollments')
          .select('program_id')
          .eq('organization_id', organizationId);

        if (enrollmentsError) throw enrollmentsError;

        setPrograms(programsData);
        setEnrolledPrograms(enrollmentsData.map(e => e.program_id));
      } catch (error) {
        toast({
          title: "Error loading programs",
          description: (error as PostgrestError).message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [organizationId, toast]);

  // Handle program enrollment changes
  const handleProgramToggle = async (programId: string) => {
    try {
      const isEnrolled = enrolledPrograms.includes(programId);
      
      if (isEnrolled) {
        // Remove enrollment
        const { error } = await supabase
          .from('program_enrollments')
          .delete()
          .eq('organization_id', organizationId)
          .eq('program_id', programId);

        if (error) throw error;

        setEnrolledPrograms(prev => prev.filter(id => id !== programId));
      } else {
        // Add enrollment
        const { error } = await supabase
          .from('program_enrollments')
          .insert([{
            organization_id: organizationId,
            program_id: programId,
            enrolled_at: new Date().toISOString()
          }]);

        if (error) throw error;

        setEnrolledPrograms(prev => [...prev, programId]);
      }

      // Notify parent component of changes
      onEnrollmentChange?.(enrolledPrograms);

      toast({
        title: "Program enrollment updated",
        description: `Successfully ${isEnrolled ? 'left' : 'joined'} the program`,
      });
    } catch (error) {
      toast({
        title: "Error updating enrollment",
        description: (error as PostgrestError).message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading programs...</div>;
  }

  // Group programs by manufacturer for better organization
  const programsByManufacturer = programs.reduce((acc, program) => {
    if (!acc[program.manufacturer_id]) {
      acc[program.manufacturer_id] = [];
    }
    acc[program.manufacturer_id].push(program);
    return acc;
  }, {} as Record<string, Program[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Program Enrollment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(programsByManufacturer).map(([manufacturerId, programs]) => (
            <div key={manufacturerId} className="space-y-4">
              <Label>
                {/* Replace with actual manufacturer name when available */}
                Manufacturer Programs
              </Label>
              
              {programs.map(program => (
                <div key={program.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={program.id}
                    checked={enrolledPrograms.includes(program.id)}
                    onCheckedChange={() => handleProgramToggle(program.id)}
                  />
                  <div className="space-y-1">
                    <Label 
                      htmlFor={program.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {program.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {program.description}
                      {program.discount_type === 'percentage' ? (
                        <span className="ml-1">({program.discount_value}% discount)</span>
                      ) : (
                        <span className="ml-1">(${program.discount_value.toFixed(2)} off)</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="mt-4">
            <Button 
              onClick={() => {
                toast({
                  title: "Programs saved",
                  description: "Your program enrollments have been updated",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};