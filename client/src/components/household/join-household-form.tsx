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

const joinHouseholdSchema = z.object({
  inviteCode: z.string().min(6, 'Invite code must be 6 characters').max(6, 'Invite code must be 6 characters'),
});

type JoinHouseholdFormData = z.infer<typeof joinHouseholdSchema>;

interface JoinHouseholdFormProps {
  onSwitchToCreate: () => void;
}

export function JoinHouseholdForm({ onSwitchToCreate }: JoinHouseholdFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { joinHousehold } = useHousehold();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinHouseholdFormData>({
    resolver: zodResolver(joinHouseholdSchema),
  });

  const onSubmit = async (data: JoinHouseholdFormData) => {
    setIsLoading(true);
    try {
      await joinHousehold(data.inviteCode);
      toast({
        title: "Joined household!",
        description: "You have successfully joined the household.",
      });
    } catch (error: any) {
      toast({
        title: "Join failed",
        description: error.message || "An error occurred while joining the household",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-users text-white text-xl"></i>
        </div>
        <CardTitle className="text-2xl font-bold">Join Household</CardTitle>
        <CardDescription>
          Enter the invite code to join an existing household
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              placeholder="Enter 6-character code"
              maxLength={6}
              {...register('inviteCode')}
              className={`uppercase ${errors.inviteCode ? 'border-red-500' : ''}`}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
            {errors.inviteCode && (
              <p className="text-sm text-red-600 mt-1">{errors.inviteCode.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Joining household...
              </>
            ) : (
              'Join Household'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need to create a new household?{' '}
            <button
              onClick={onSwitchToCreate}
              className="text-primary hover:underline font-medium"
            >
              Create household
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
