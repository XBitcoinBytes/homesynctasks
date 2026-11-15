import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { defaultZones, predefinedTasks } from '@/lib/predefined-tasks';

type SetupStep = 'zones' | 'tasks' | 'frequencies' | 'complete';

export default function Setup() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<SetupStep>('zones');
  const [selectedZones, setSelectedZones] = useState<string[]>(['Kitchen', 'Living Room', 'Bathroom']);
  const [customZones, setCustomZones] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskFrequencies, setTaskFrequencies] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleZoneToggle = (zone: string) => {
    setSelectedZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    );
  };

  const handleAddCustomZone = () => {
    if (customZones.trim()) {
      const zones = customZones.split(',').map(z => z.trim()).filter(z => z);
      setSelectedZones(prev => [...prev, ...zones]);
      setCustomZones('');
    }
  };

  const handleTaskToggle = (taskName: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskName)) {
        const newTasks = prev.filter(t => t !== taskName);
        const newFrequencies = { ...taskFrequencies };
        delete newFrequencies[taskName];
        setTaskFrequencies(newFrequencies);
        return newTasks;
      } else {
        const task = predefinedTasks.find(t => t.name === taskName);
        if (task) {
          setTaskFrequencies(prev => ({
            ...prev,
            [taskName]: task.defaultFrequency
          }));
        }
        return [...prev, taskName];
      }
    });
  };

  const handleFrequencyChange = (taskName: string, frequency: string) => {
    setTaskFrequencies(prev => ({
      ...prev,
      [taskName]: frequency
    }));
  };

  const handleFinishSetup = () => {
    toast({
      title: "Setup Complete!",
      description: "Your household is ready to go. Welcome to HomeSync!"
    });
    setLocation('/');
  };

  const getStepProgress = () => {
    const steps = ['zones', 'tasks', 'frequencies', 'complete'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  const renderZonesStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-map-marker-alt text-primary"></i>
          Set Up Your Zones & Rooms
        </CardTitle>
        <CardDescription>
          Select the areas in your home that need regular maintenance. You can always add more later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Common Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {defaultZones.filter(zone => zone.type === 'indoor').map(zone => (
              <div key={zone.name} className="flex items-center space-x-2">
                <Checkbox
                  id={zone.name}
                  checked={selectedZones.includes(zone.name)}
                  onCheckedChange={() => handleZoneToggle(zone.name)}
                />
                <Label htmlFor={zone.name} className="text-sm">{zone.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Outdoor Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {defaultZones.filter(zone => zone.type === 'outdoor').map(zone => (
              <div key={zone.name} className="flex items-center space-x-2">
                <Checkbox
                  id={zone.name}
                  checked={selectedZones.includes(zone.name)}
                  onCheckedChange={() => handleZoneToggle(zone.name)}
                />
                <Label htmlFor={zone.name} className="text-sm">{zone.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Custom Zones</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom zones (comma-separated)"
              value={customZones}
              onChange={(e) => setCustomZones(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomZone()}
            />
            <Button onClick={handleAddCustomZone} variant="outline">Add</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Examples: Home Theater, Wine Cellar, Workshop, Pool House
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedZones.map(zone => (
            <Badge key={zone} variant="secondary" className="cursor-pointer" onClick={() => handleZoneToggle(zone)}>
              {zone} ✕
            </Badge>
          ))}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentStep('tasks')}
            disabled={selectedZones.length === 0}
            className="flex-1"
          >
            Continue to Tasks
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTasksStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-tasks text-primary"></i>
          Choose Your Tasks
        </CardTitle>
        <CardDescription>
          Select the tasks you want to track. We've organized them by category to make it easier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {['cleaning', 'maintenance', 'yardwork', 'seasonal'].map(category => (
          <div key={category}>
            <h3 className="font-medium mb-3 capitalize">{category} Tasks</h3>
            <div className="grid gap-2">
              {predefinedTasks
                .filter(task => task.category === category)
                .slice(0, 8)
                .map(task => (
                  <div key={task.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={task.name}
                        checked={selectedTasks.includes(task.name)}
                        onCheckedChange={() => handleTaskToggle(task.name)}
                      />
                      <div>
                        <Label htmlFor={task.name} className="text-sm font-medium">{task.name}</Label>
                        {task.description && (
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {task.estimatedDuration}min • {task.defaultFrequency}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            Selected {selectedTasks.length} tasks. You can customize frequencies on the next step.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep('zones')}>
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep('frequencies')}
            disabled={selectedTasks.length === 0}
            className="flex-1"
          >
            Set Frequencies
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFrequenciesStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-calendar-alt text-primary"></i>
          Customize Frequencies
        </CardTitle>
        <CardDescription>
          Adjust how often each task should be done. These are just starting points - you can change them anytime.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedTasks.map(taskName => {
          const task = predefinedTasks.find(t => t.name === taskName);
          return (
            <div key={taskName} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium text-sm">{taskName}</p>
                <p className="text-xs text-muted-foreground">
                  Estimated time: {task?.estimatedDuration}min
                </p>
              </div>
              <select
                value={taskFrequencies[taskName] || task?.defaultFrequency}
                onChange={(e) => handleFrequencyChange(taskName, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="as-needed">As needed</option>
              </select>
            </div>
          );
        })}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep('tasks')}>
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </Button>
          <Button onClick={() => setCurrentStep('complete')} className="flex-1">
            Finish Setup
            <i className="fas fa-check ml-2"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-green-600 text-2xl"></i>
        </div>
        <CardTitle className="text-2xl">All Set!</CardTitle>
        <CardDescription className="text-base">
          Your household is now configured and ready to help you stay organized.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{selectedZones.length}</div>
            <div className="text-sm text-blue-800">Zones configured</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{selectedTasks.length}</div>
            <div className="text-sm text-green-800">Tasks scheduled</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">What's next?</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• View your dashboard to see upcoming tasks</li>
            <li>• Invite family members with your household code</li>
            <li>• Customize zones and add more tasks anytime</li>
            <li>• Set up notifications in Settings</li>
          </ul>
        </div>

        <Button onClick={handleFinishSetup} className="w-full" size="lg">
          <i className="fas fa-home mr-2"></i>
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Setup Progress</span>
            <span>{Math.round(getStepProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center">
          {currentStep === 'zones' && renderZonesStep()}
          {currentStep === 'tasks' && renderTasksStep()}
          {currentStep === 'frequencies' && renderFrequenciesStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </div>
    </div>
  );
}