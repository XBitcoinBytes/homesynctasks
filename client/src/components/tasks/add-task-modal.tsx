import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useHousehold } from '@/hooks/use-household';

const addTaskSchema = z.object({
  name: z.string().min(2, 'Task name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  zoneId: z.string().min(1, 'Please select a room/zone'),
  frequency: z.string().min(1, 'Please select a frequency'),
  estimatedDuration: z.string().min(1, 'Please select estimated duration'),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  customDetails: z.object({
    weedType: z.string().optional(),
    plantType: z.string().optional(),
    seasonalAction: z.string().optional(),
    maintenanceType: z.string().optional(),
  }).optional(),
});

type AddTaskFormData = z.infer<typeof addTaskSchema>;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

export function AddTaskModal({ isOpen, onClose, onTaskAdded }: AddTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();
  const { members } = useHousehold();

  // Fetch available zones/rooms
  const { data: zones = [] } = useQuery({
    queryKey: ['/api/households/1/zones'],
    enabled: isOpen,
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
  });

  // Homeowner-specific customization options
  const weedTypes = [
    'Dandelions', 'Crabgrass', 'Clover', 'Chickweed', 'Plantain', 'Thistle',
    'Bindweed', 'Poison Ivy', 'English Ivy', 'Wild Garlic', 'Moss', 'General Weeding'
  ];

  const plantTypes = [
    'Roses', 'Tulips', 'Daffodils', 'Petunias', 'Marigolds', 'Impatiens',
    'Hostas', 'Lavender', 'Hydrangeas', 'Azaleas', 'Tomatoes', 'Herbs',
    'Perennials', 'Annuals', 'Bulbs', 'Shrubs', 'Trees'
  ];

  const seasonalActions = [
    'Spring Cleanup', 'Fall Cleanup', 'Winter Preparation', 'Summer Maintenance',
    'Mulching', 'Fertilizing', 'Pruning', 'Seeding', 'Aeration', 'Dethatching'
  ];

  const maintenanceTypes = [
    'Septic Tank Pumping', 'Driveway Sealing', 'Roof Inspection', 'Gutter Cleaning',
    'HVAC Service', 'Sprinkler System Opening', 'Sprinkler System Closing',
    'Pool Opening', 'Pool Closing', 'Deck Staining', 'Fence Repair'
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Every 2 weeks' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Every 3 months' },
    { value: 'bi-annually', label: 'Every 6 months' },
    { value: 'annually', label: 'Yearly' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  const durations = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4+ hours' }
  ];

  // Comprehensive room and zone database for specific task assignments
  const roomZoneDatabase = [
    // Interior Rooms
    { id: 1, name: 'Living Room', type: 'interior', icon: '🛋️' },
    { id: 2, name: 'Kitchen', type: 'interior', icon: '🍳' },
    { id: 3, name: 'Master Bedroom', type: 'interior', icon: '🛏️' },
    { id: 4, name: 'Guest Bedroom', type: 'interior', icon: '🛌' },
    { id: 5, name: 'Kids Bedroom', type: 'interior', icon: '🧸' },
    { id: 6, name: 'Master Bathroom', type: 'interior', icon: '🛁' },
    { id: 7, name: 'Guest Bathroom', type: 'interior', icon: '🚿' },
    { id: 8, name: 'Powder Room', type: 'interior', icon: '🚽' },
    { id: 9, name: 'Basement Bathroom', type: 'interior', icon: '🔧' },
    { id: 10, name: 'Dining Room', type: 'interior', icon: '🍽️' },
    { id: 11, name: 'Home Office', type: 'interior', icon: '💻' },
    { id: 12, name: 'Family Room', type: 'interior', icon: '📺' },
    { id: 13, name: 'Laundry Room', type: 'interior', icon: '🧺' },
    { id: 14, name: 'Pantry', type: 'interior', icon: '🏪' },
    { id: 15, name: 'Walk-in Closet', type: 'interior', icon: '👗' },
    { id: 16, name: 'Hallway', type: 'interior', icon: '🚪' },
    { id: 17, name: 'Foyer', type: 'interior', icon: '🚪' },
    { id: 18, name: 'Mudroom', type: 'interior', icon: '👢' },
    
    // Basement Areas
    { id: 19, name: 'Finished Basement', type: 'basement', icon: '🔦' },
    { id: 20, name: 'Basement Storage', type: 'basement', icon: '📦' },
    { id: 21, name: 'Basement Workshop', type: 'basement', icon: '🔨' },
    { id: 22, name: 'Wine Cellar', type: 'basement', icon: '🍷' },
    
    // Attic Areas
    { id: 23, name: 'Attic Storage', type: 'attic', icon: '📦' },
    { id: 24, name: 'Finished Attic', type: 'attic', icon: '🏠' },
    
    // Garage Areas
    { id: 25, name: 'Main Garage', type: 'garage', icon: '🚗' },
    { id: 26, name: 'Garage Workshop', type: 'garage', icon: '🔧' },
    { id: 27, name: 'Garage Storage', type: 'garage', icon: '📦' },
    
    // Outdoor Areas
    { id: 28, name: 'Front Yard', type: 'exterior', icon: '🌳' },
    { id: 29, name: 'Back Yard', type: 'exterior', icon: '🌿' },
    { id: 30, name: 'Side Yard', type: 'exterior', icon: '🌱' },
    { id: 31, name: 'Front Garden', type: 'exterior', icon: '🌺' },
    { id: 32, name: 'Back Garden', type: 'exterior', icon: '🌸' },
    { id: 33, name: 'Vegetable Garden', type: 'exterior', icon: '🥕' },
    { id: 34, name: 'Flower Beds', type: 'exterior', icon: '🌻' },
    { id: 35, name: 'Driveway', type: 'exterior', icon: '🛣️' },
    { id: 36, name: 'Front Walkway', type: 'exterior', icon: '🚶' },
    { id: 37, name: 'Back Patio', type: 'exterior', icon: '🌅' },
    { id: 38, name: 'Front Porch', type: 'exterior', icon: '🏠' },
    { id: 39, name: 'Deck', type: 'exterior', icon: '🌅' },
    
    // Special Areas
    { id: 40, name: 'Pool Area', type: 'recreation', icon: '🏊' },
    { id: 41, name: 'Hot Tub', type: 'recreation', icon: '♨️' },
    { id: 42, name: 'Basketball Court', type: 'recreation', icon: '🏀' },
    { id: 43, name: 'Tennis Court', type: 'recreation', icon: '🎾' },
    { id: 44, name: 'Beach Area', type: 'recreation', icon: '🏖️' },
    { id: 45, name: 'Sandbox', type: 'recreation', icon: '🏰' },
    { id: 46, name: 'Swing Set', type: 'recreation', icon: '🎪' },
    { id: 47, name: 'Trampoline Area', type: 'recreation', icon: '🤸' },
    { id: 48, name: 'Fire Pit Area', type: 'recreation', icon: '🔥' },
    { id: 49, name: 'Gazebo', type: 'recreation', icon: '🏯' },
    { id: 50, name: 'Pergola', type: 'recreation', icon: '🌿' },
    
    // Utility Areas
    { id: 51, name: 'Shed', type: 'storage', icon: '🏘️' },
    { id: 52, name: 'Tool Shed', type: 'storage', icon: '🔧' },
    { id: 53, name: 'Garden Shed', type: 'storage', icon: '🌿' },
    { id: 54, name: 'Greenhouse', type: 'storage', icon: '🌱' },
    { id: 55, name: 'Chicken Coop', type: 'exterior', icon: '🐔' },
    { id: 56, name: 'Dog Run', type: 'exterior', icon: '🐕' }
  ];

  // Room-specific task templates for common household tasks
  const roomSpecificTaskTemplates = {
    'dust light fixtures': {
      kitchen: 'Dust light fixtures in kitchen',
      livingRoom: 'Dust light fixtures in living room',
      masterBedroom: 'Dust light fixtures in master bedroom',
      guestBedroom: 'Dust light fixtures in guest bedroom',
      diningRoom: 'Dust light fixtures in dining room',
      homeOffice: 'Dust light fixtures in home office'
    },
    'vacuum': {
      livingRoom: 'Vacuum living room',
      masterBedroom: 'Vacuum master bedroom',
      guestBedroom: 'Vacuum guest bedroom',
      diningRoom: 'Vacuum dining room',
      homeOffice: 'Vacuum home office',
      familyRoom: 'Vacuum family room',
      hallway: 'Vacuum hallway'
    },
    'clean bathroom': {
      masterBathroom: 'Clean master bathroom',
      guestBathroom: 'Clean guest bathroom',
      powderRoom: 'Clean powder room',
      basementBathroom: 'Clean basement bathroom'
    },
    'dust surfaces': {
      kitchen: 'Dust kitchen surfaces and counters',
      livingRoom: 'Dust living room surfaces',
      masterBedroom: 'Dust master bedroom surfaces',
      diningRoom: 'Dust dining room surfaces',
      homeOffice: 'Dust home office surfaces'
    },
    'clean windows': {
      kitchen: 'Clean kitchen windows',
      livingRoom: 'Clean living room windows',
      masterBedroom: 'Clean master bedroom windows',
      diningRoom: 'Clean dining room windows'
    }
  };

  const generateRoomSpecificTaskName = (taskName: string, selectedZoneId: string) => {
    const selectedRoom = roomZoneDatabase.find(room => room.id.toString() === selectedZoneId);
    if (!selectedRoom) return taskName;

    // Convert task name to lowercase for matching
    const lowerTaskName = taskName.toLowerCase();
    
    // Check if this is a generic task that should be room-specific
    for (const [genericTask, roomVariants] of Object.entries(roomSpecificTaskTemplates)) {
      if (lowerTaskName.includes(genericTask)) {
        // Convert room name to camelCase key
        const roomKey = selectedRoom.name.toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[^a-z0-9]/gi, '');
        
        // Return specific room task if available, otherwise create dynamic one
        return roomVariants[roomKey as keyof typeof roomVariants] || 
               `${taskName} in ${selectedRoom.name}`;
      }
    }

    // For other tasks, automatically add room context if not already included
    if (!lowerTaskName.includes('in ') && !lowerTaskName.includes(selectedRoom.name.toLowerCase())) {
      return `${taskName} in ${selectedRoom.name}`;
    }

    return taskName;
  };

  const onSubmit = async (data: AddTaskFormData) => {
    setIsLoading(true);
    try {
      // Generate room-specific task name
      const roomSpecificName = generateRoomSpecificTaskName(data.name, data.zoneId);
      
      // Create task template first
      const templateResponse = await fetch('/api/task-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomSpecificName,
          category: data.category,
          defaultFrequency: data.frequency,
          estimatedDuration: parseInt(data.estimatedDuration),
          description: data.notes || null,
          isCustom: true,
          householdId: 1 // Use current household ID
        })
      });

      if (!templateResponse.ok) {
        throw new Error('Failed to create task template');
      }

      const template = await templateResponse.json();

      // Create actual task instance
      const taskResponse = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          zoneId: parseInt(data.zoneId),
          frequency: data.frequency,
          assignedTo: data.assignedTo && data.assignedTo !== "auto" ? parseInt(data.assignedTo) : null,
          householdId: 1,
          createdBy: 1, // Current user ID
          nextDue: new Date(),
          isActive: true,
          notes: data.notes || null
        })
      });

      if (!taskResponse.ok) {
        throw new Error('Failed to create task');
      }
      
      toast({
        title: "Task added!",
        description: `"${roomSpecificName}" has been successfully created and scheduled.`,
      });
      
      reset();
      onTaskAdded();
    } catch (error: any) {
      toast({
        title: "Failed to add task",
        description: error.message || "An error occurred while creating the task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for your household
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-orange-800 font-semibold">₿ Task Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dust light fixtures, Vacuum, Clean bathroom, Organize closet"
                {...register('name')}
                className={`border-2 ${errors.name ? 'border-red-500 bg-red-50' : 'border-orange-200'} focus:border-orange-400 focus:ring-2 focus:ring-orange-200`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 font-semibold">{errors.name.message}</p>
              )}
              <p className="text-xs text-orange-600 mt-1 font-medium">
                💡 Tip: Enter generic tasks like "dust light fixtures" - we'll automatically make it room-specific!
              </p>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="yardwork">Yardwork</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="zoneId">Room/Zone</Label>
              <Select onValueChange={(value) => setValue('zoneId', value)}>
                <SelectTrigger className={errors.zoneId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select room/zone" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {(zones as any[]).map((zone: any) => (
                    <SelectItem key={zone.id} value={zone.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{zone.type === 'indoor' ? '🏠' : '🌿'}</span>
                        <span>{zone.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {zone.type}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {(zones as any[]).length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No zones available. Create some zones first.
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.zoneId && (
                <p className="text-sm text-red-600 mt-1">{errors.zoneId.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select onValueChange={(value) => setValue('frequency', value)}>
                <SelectTrigger className={errors.frequency ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="every 3 months">Every 3 months</SelectItem>
                  <SelectItem value="every 6 months">Every 6 months</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="text-sm text-red-600 mt-1">{errors.frequency.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Select onValueChange={(value) => setValue('estimatedDuration', value)}>
                <SelectTrigger className={errors.estimatedDuration ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3+ hours</SelectItem>
                </SelectContent>
              </Select>
              {errors.estimatedDuration && (
                <p className="text-sm text-red-600 mt-1">{errors.estimatedDuration.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="assignedTo">Assign to</Label>
              <Select onValueChange={(value) => setValue('assignedTo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-assign</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.userId} value={member.userId.toString()}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Add any specific instructions or notes..."
              {...register('notes')}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700">
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Adding task...
                </>
              ) : (
                'Add Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
