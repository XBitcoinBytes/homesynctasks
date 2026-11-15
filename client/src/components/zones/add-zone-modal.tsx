import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useHousehold } from '@/hooks/use-household';

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onZoneAdded?: () => void;
}

export function AddZoneModal({ isOpen, onClose, onZoneAdded }: AddZoneModalProps) {
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { household } = useHousehold();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zoneName.trim() || !zoneType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: zoneName.trim(),
          type: zoneType,
          householdId: household?.id || 1,
          isCustom: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create zone');
      }

      toast({
        title: "Zone Created Successfully",
        description: `${zoneName} has been added to your household zones`,
      });

      setZoneName('');
      setZoneType('');
      
      onZoneAdded?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating zone:', error);
      toast({
        title: "Error Creating Zone",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setZoneName('');
    setZoneType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border-4 border-purple-400 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-violet-200/20 pointer-events-none" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text flex items-center gap-3">
            <div className="text-4xl">🏠</div>
            Add New Zone
            <div className="text-2xl">✨</div>
          </DialogTitle>
          <DialogDescription className="text-purple-700 font-semibold text-lg">
            Create a new area in your home for organized task management
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="zoneName" className="text-lg font-bold text-purple-800">
              Zone Name *
            </Label>
            <Input
              id="zoneName"
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g., Kitchen, Master Bedroom, Garage"
              className="text-lg p-4 bg-white/80 border-3 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoneType" className="text-lg font-bold text-purple-800">
              Zone Type *
            </Label>
            <Select value={zoneType} onValueChange={setZoneType} required>
              <SelectTrigger className="text-lg p-4 bg-white/80 border-3 border-purple-300 rounded-xl focus:border-purple-500">
                <SelectValue placeholder="Select zone type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-purple-300 rounded-xl">
                <SelectItem value="indoor" className="text-lg p-3 hover:bg-purple-50">
                  🏠 Indoor
                </SelectItem>
                <SelectItem value="outdoor" className="text-lg p-3 hover:bg-purple-50">
                  🌿 Outdoor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-8 py-3 text-lg font-semibold border-3 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  Create Zone
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}