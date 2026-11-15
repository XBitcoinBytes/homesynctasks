import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const acceptInviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

interface AcceptInviteProps {
  inviteCode: string;
  onSuccess: () => void;
}

export function AcceptInvite({ inviteCode, onSuccess }: AcceptInviteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [householdInfo, setHouseholdInfo] = useState<any>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
  });

  useEffect(() => {
    // Validate invite code and get household info
    const validateInvite = async () => {
      try {
        const response = await fetch(`/api/validate-invite/${inviteCode}`);
        if (response.ok) {
          const data = await response.json();
          setHouseholdInfo(data.household);
        }
      } catch (error) {
        console.error('Failed to validate invite:', error);
      }
    };
    
    validateInvite();
  }, [inviteCode]);

  const onSubmit = async (data: AcceptInviteFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode,
          name: data.name,
          email: data.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Welcome to the family!",
          description: `You've successfully joined ${householdInfo?.name || 'the household'}`,
        });
        onSuccess();
      } else {
        throw new Error(result.message || 'Failed to accept invitation');
      }
    } catch (error: any) {
      toast({
        title: "Failed to join",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!householdInfo) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Validating invitation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Join {householdInfo.name}
        </CardTitle>
        <CardDescription className="text-lg">
          You've been invited to collaborate on household tasks!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Joining...
              </span>
            ) : (
              'Join Household'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Once you join, you'll be able to:</p>
          <ul className="mt-2 space-y-1">
            <li>• View and manage household tasks</li>
            <li>• Create and assign tasks</li>
            <li>• Track completion progress</li>
            <li>• Collaborate with family members</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}