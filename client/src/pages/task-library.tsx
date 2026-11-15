import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { predefinedTasks } from '@/lib/predefined-tasks';

export default function TaskLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const filteredTasks = predefinedTasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByCategory = {
    cleaning: filteredTasks.filter(t => t.category === 'cleaning'),
    maintenance: filteredTasks.filter(t => t.category === 'maintenance'),
    yardwork: filteredTasks.filter(t => t.category === 'yardwork'),
    seasonal: filteredTasks.filter(t => t.category === 'seasonal'),
  };

  const toggleTask = (taskName: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskName)) {
      newSelected.delete(taskName);
    } else {
      newSelected.add(taskName);
    }
    setSelectedTasks(newSelected);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return 'fas fa-broom';
      case 'maintenance': return 'fas fa-wrench';
      case 'yardwork': return 'fas fa-leaf';
      case 'seasonal': return 'fas fa-calendar-alt';
      default: return 'fas fa-tasks';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'yardwork': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const renderTaskList = (tasks: typeof predefinedTasks) => (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.name}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedTasks.has(task.name)
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => toggleTask(task.name)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTasks.has(task.name) ? 'bg-primary-600' : 'bg-slate-100'
                }`}>
                  <i className={`${getCategoryIcon(task.category)} ${
                    selectedTasks.has(task.name) ? 'text-white' : 'text-slate-600'
                  }`}></i>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{task.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {task.defaultFrequency}
                    </span>
                    <span className="text-sm text-slate-500">
                      ~{task.estimatedDuration} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedTasks.has(task.name)
                  ? 'border-primary-600 bg-primary-600'
                  : 'border-slate-300'
              }`}>
                {selectedTasks.has(task.name) && (
                  <i className="fas fa-check text-white text-xs"></i>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Task Library</h1>
              <p className="text-slate-600">
                Choose from our collection of {predefinedTasks.length}+ predefined household tasks
              </p>
            </div>

            {/* Search and Actions */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <i className="fas fa-plus mr-2"></i>
                  Add Custom Task
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Add Selected ({selectedTasks.size})
                </Button>
              </div>
            </div>

            {/* Task Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Available Tasks</h2>
                  <div className="text-sm text-slate-500">
                    {selectedTasks.size} of {filteredTasks.length} selected
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
                    <TabsTrigger value="cleaning">
                      Cleaning ({tasksByCategory.cleaning.length})
                    </TabsTrigger>
                    <TabsTrigger value="maintenance">
                      Maintenance ({tasksByCategory.maintenance.length})
                    </TabsTrigger>
                    <TabsTrigger value="yardwork">
                      Yardwork ({tasksByCategory.yardwork.length})
                    </TabsTrigger>
                    <TabsTrigger value="seasonal">
                      Seasonal ({tasksByCategory.seasonal.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    {renderTaskList(filteredTasks)}
                  </TabsContent>
                  
                  <TabsContent value="cleaning" className="mt-6">
                    {renderTaskList(tasksByCategory.cleaning)}
                  </TabsContent>
                  
                  <TabsContent value="maintenance" className="mt-6">
                    {renderTaskList(tasksByCategory.maintenance)}
                  </TabsContent>
                  
                  <TabsContent value="yardwork" className="mt-6">
                    {renderTaskList(tasksByCategory.yardwork)}
                  </TabsContent>
                  
                  <TabsContent value="seasonal" className="mt-6">
                    {renderTaskList(tasksByCategory.seasonal)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
