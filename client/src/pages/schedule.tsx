import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Enhanced schedule data with more realistic tasks
  const scheduleData = [
    {
      date: new Date(),
      tasks: [
        { id: 1, name: 'Clean kitchen counters', zone: 'Kitchen', duration: 15, assignedTo: 'Sarah', priority: 'high' },
        { id: 2, name: 'Vacuum living room', zone: 'Living Room', duration: 20, assignedTo: 'Mike', priority: 'medium' },
        { id: 3, name: 'Empty dishwasher', zone: 'Kitchen', duration: 10, assignedTo: 'Emma', priority: 'low' },
        { id: 4, name: 'Water indoor plants', zone: 'Living Room', duration: 5, assignedTo: 'John', priority: 'low' },
      ]
    },
    {
      date: addDays(new Date(), 1),
      tasks: [
        { id: 5, name: 'Bathroom deep clean', zone: 'Bathroom', duration: 45, assignedTo: 'Sarah', priority: 'high' },
        { id: 6, name: 'Laundry - wash and fold', zone: 'Laundry Room', duration: 30, assignedTo: 'Mike', priority: 'medium' },
        { id: 7, name: 'Dust bedroom furniture', zone: 'Bedroom', duration: 20, assignedTo: 'Emma', priority: 'low' },
      ]
    },
    {
      date: addDays(new Date(), 2),
      tasks: [
        { id: 8, name: 'Mow front lawn', zone: 'Front Yard', duration: 45, assignedTo: 'John', priority: 'high' },
        { id: 9, name: 'Clean windows', zone: 'Living Room', duration: 30, assignedTo: 'Sarah', priority: 'medium' },
        { id: 10, name: 'Organize pantry', zone: 'Kitchen', duration: 25, assignedTo: 'Mike', priority: 'low' },
      ]
    },
    {
      date: addDays(new Date(), 3),
      tasks: [
        { id: 11, name: 'Change bed sheets', zone: 'Bedroom', duration: 15, assignedTo: 'Emma', priority: 'medium' },
        { id: 12, name: 'Clean garage', zone: 'Garage', duration: 60, assignedTo: 'John', priority: 'low' },
      ]
    },
    {
      date: addDays(new Date(), 4),
      tasks: [
        { id: 13, name: 'Deep clean carpets', zone: 'Living Room', duration: 90, assignedTo: 'Sarah', priority: 'high' },
        { id: 14, name: 'Trim bushes', zone: 'Front Yard', duration: 40, assignedTo: 'Mike', priority: 'medium' },
      ]
    },
  ];

  const getTasksForDate = (date: Date) => {
    const dayData = scheduleData.find(d => isSameDay(d.date, date));
    return dayData?.tasks || [];
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const totalDuration = selectedDateTasks.reduce((sum, task) => sum + task.duration, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Schedule</h1>
              <p className="text-slate-600">
                View and manage your household task schedule
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Calendar</h2>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      hasTask: scheduleData.map(d => d.date)
                    }}
                    modifiersStyles={{
                      hasTask: { 
                        backgroundColor: 'hsl(207, 90%, 54%)', 
                        color: 'white',
                        borderRadius: '4px'
                      }
                    }}
                  />
                  
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <h3 className="font-medium text-slate-900 mb-2">Legend</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span className="text-slate-600">Days with tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Tasks */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {selectedDateTasks.length} tasks • ~{totalDuration} minutes total
                      </p>
                    </div>
                    <Button className="bg-primary-600 hover:bg-primary-700">
                      <i className="fas fa-plus mr-2"></i>
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDateTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-calendar-check text-4xl text-slate-300 mb-4"></i>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks scheduled</h3>
                      <p className="text-slate-500 mb-4">This day is free of scheduled tasks</p>
                      <Button variant="outline">
                        <i className="fas fa-plus mr-2"></i>
                        Add a task
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 border rounded-lg ${
                            task.overdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                task.overdue ? 'bg-red-100' : 'bg-blue-100'
                              }`}>
                                <i className={`fas fa-tasks ${
                                  task.overdue ? 'text-red-600' : 'text-blue-600'
                                }`}></i>
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-900">{task.name}</h3>
                                <p className="text-sm text-slate-500">{task.zone}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {task.overdue && (
                                    <Badge variant="destructive">Overdue</Badge>
                                  )}
                                  {task.assignedTo && (
                                    <span className="text-xs text-slate-400">
                                      Assigned to: {task.assignedTo}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-slate-500">~{task.duration} min</span>
                              <Button variant="ghost" size="sm">
                                <i className="fas fa-ellipsis-v"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Overview */}
            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-lg font-semibold">This Week</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = addDays(new Date(), i - new Date().getDay());
                    const tasks = getTasksForDate(date);
                    const dayTotal = tasks.reduce((sum, task) => sum + task.duration, 0);
                    
                    return (
                      <div
                        key={i}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSameDay(date, selectedDate)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="text-center">
                          <p className="text-xs font-medium text-slate-500 uppercase">
                            {format(date, 'EEE')}
                          </p>
                          <p className="text-lg font-semibold text-slate-900 mt-1">
                            {format(date, 'd')}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs text-slate-500">{tasks.length} tasks</p>
                            <p className="text-xs text-slate-500">~{dayTotal}m</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
