import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHousehold } from '@/hooks/use-household';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const createHouseholdSchema = z.object({
  name: z.string().min(2, 'Household name must be at least 2 characters'),
});

type CreateHouseholdFormData = z.infer<typeof createHouseholdSchema>;

interface CreateHouseholdFormProps {
  onSwitchToJoin: () => void;
}

export function CreateHouseholdForm({ onSwitchToJoin }: CreateHouseholdFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createHousehold } = useHousehold();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHouseholdFormData>({
    resolver: zodResolver(createHouseholdSchema),
  });

  const onSubmit = async (data: CreateHouseholdFormData) => {
    setIsLoading(true);
    try {
      await createHousehold(data.name);
      toast({
        title: "Household created!",
        description: "Let's set up your zones and tasks.",
      });
      // Redirect to setup flow after successful creation
      setTimeout(() => {
        setLocation('/setup');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message || "An error occurred while creating the household",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-home text-white text-xl"></i>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome to HomeSync!</CardTitle>
        <CardDescription className="text-base">
          Let's set up your household so you can start organizing and managing all your home tasks together. Give your household a name that everyone will recognize.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Household Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., The Smith Family, Our Home, Miller House"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This name will be visible to all household members
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• You'll get access to 100+ predefined household tasks</li>
              <li>• Set up custom zones for your property (pools, courts, gardens)</li>
              <li>• Invite family members with a simple invite code</li>
              <li>• Start organizing and scheduling all your home maintenance</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating household...
              </>
            ) : (
              'Create Household'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an invite code?{' '}
            <button
              onClick={onSwitchToJoin}
              className="text-primary hover:underline font-medium"
            >
              Join household
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
