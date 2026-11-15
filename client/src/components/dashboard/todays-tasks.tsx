import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/components/tasks/task-item';
import { AddTaskModal } from '@/components/tasks/add-task-modal';
import { ArrowRight } from 'lucide-react';
import type { Task, TaskTemplate, Zone, User } from '@shared/schema';

interface TodaysTasksProps {
  tasks: (Task & { template: TaskTemplate; zone: Zone; assignedUser?: User })[];
  onTaskComplete: (taskId: number) => void;
  onTaskUpdate: (task: Task) => void;
}

export function TodaysTasks({ tasks, onTaskComplete, onTaskUpdate }: TodaysTasksProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [, setLocation] = useLocation();
  
  const completedCount = tasks.filter(task => task.lastCompleted && 
    new Date(task.lastCompleted).toDateString() === new Date().toDateString()).length;
  const pendingCount = tasks.length - completedCount;

  const getMotivationalMessage = () => {
    if (tasks.length === 0) return "Your home is in excellent shape today!";
    if (completedCount === tasks.length) return "Amazing! You've completed everything today!";
    if (completedCount > 0) return `Great progress! ${pendingCount} tasks remaining.`;
    return "Let's keep your home in top condition!";
  };

  return (
    <>
      <Card className="lg:col-span-2 premium-card-sparkle">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <span className="mr-2 text-xl">🏠</span>
                Today's Home Care
              </h2>
              <p className="text-sm text-slate-500 mt-1">{getMotivationalMessage()}</p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="btn-shimmer bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 shadow-lg"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Task
            </Button>
          </div>
          
          {tasks.length > 0 && (
            <div className="flex gap-4 mt-3">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-slate-600">{completedCount} completed</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-slate-600">{pendingCount} pending</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 silver-sprinkles">
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-home text-2xl text-emerald-600"></i>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Home is perfectly maintained!</h3>
                <p className="text-slate-500 mb-4">No urgent tasks today. Your proactive care is paying off!</p>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
                  <span className="text-sm text-slate-600">Regular maintenance prevents costly repairs</span>
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={() => onTaskComplete(task.id)}
                  onUpdate={onTaskUpdate}
                />
              ))
            )}

            {tasks.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setLocation('/schedule')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center group transition-colors"
                >
                  View complete schedule 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onTaskAdded={() => {
          setShowAddModal(false);
          // Refresh tasks would be handled by parent component
        }}
      />
    </>
  );
}
