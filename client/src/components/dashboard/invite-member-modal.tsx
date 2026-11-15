import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useHousehold } from '@/hooks/use-household';
import { Copy, Share2, Mail, Send } from 'lucide-react';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const { toast } = useToast();
  const { household } = useHousehold();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const generateInviteLink = async () => {
    setIsLoading(true);
    try {
      if (!household?.inviteCode) {
        throw new Error('No invite code available');
      }
      
      const baseUrl = window.location.origin;
      const link = `${baseUrl}?invite=${household.inviteCode}`;
      setInviteLink(link);
      
      toast({
        title: "Invite link ready!",
        description: "Share this link with anyone to invite them to your household",
      });
    } catch (error: any) {
      toast({
        title: "Failed to generate link",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const sendEmailInvitation = async (data: InviteFormData) => {
    if (!household) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          householdName: household.name,
          inviteCode: household.inviteCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Invitation sent!",
          description: `Email invitation sent to ${data.email}`,
        });
        onClose();
      } else {
        throw new Error(result.message || 'Failed to send invitation');
      }
    } catch (error: any) {
      toast({
        title: "Invitation Failed",
        description: "Failed to send email invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareByEmail = () => {
    const subject = `Join our Household: ${household?.name || 'HomeSync Tasks'}`;
    const body = `You're invited to join our household "${household?.name}" on HomeSync Tasks!

Use this invite code: ${household?.inviteCode}

Start collaborating on household tasks with us!

Join at: ${window.location.origin}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border shadow-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Invite Family Members
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose the easiest way to invite someone
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Big Share Link Button */}
          <Button
            onClick={generateInviteLink}
            disabled={isLoading}
            className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-3"
          >
            <Share2 className="h-6 w-6" />
            Get Shareable Link
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Easiest</span>
          </Button>
          
          {/* Show Generated Link */}
          {inviteLink && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Share this link:</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Simple Email Section */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Or send via email:</Label>
            <form onSubmit={handleSubmit(sendEmailInvitation)} className="flex gap-2">
              <Input
                placeholder="Enter email address"
                {...register('email')}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          {/* Quick Share Options */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick share:</Label>
            <Button
              onClick={handleShareByEmail}
              variant="outline"
              className="w-full h-12 text-sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              Open Email App
            </Button>
          </div>
          
          {/* Invite Code Display */}
          <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Your invite code:</strong> {household?.inviteCode}</p>
            <p>Anyone can enter this code to join</p>
          </div>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}