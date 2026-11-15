import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Task, TaskTemplate, Zone } from '@shared/schema';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

interface UpcomingTasksProps {
  tasks: (Task & { template: TaskTemplate; zone: Zone })[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const formatDueDate = (dueDate: Date) => {
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    if (dueDate <= addDays(new Date(), 7)) return format(dueDate, 'EEEE');
    return format(dueDate, 'MMM d');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'maintenance': return '🔧';
      case 'yardwork': return '🌿';
      case 'seasonal': return '🗓️';
      default: return '📋';
    }
  };

  const getPriorityColor = (dueDate: Date) => {
    const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 1) return 'bg-red-100 text-red-700 border-red-200';
    if (daysUntilDue <= 3) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <Card className="premium-card-sparkle">
      <CardHeader className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900 flex items-center">
          <span className="mr-2 text-lg">📅</span>
          Coming Up
        </h3>
        <p className="text-xs text-slate-500 mt-1">Stay ahead of your home care schedule</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No urgent tasks on the horizon</p>
            </div>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {getCategoryIcon(task.template.category)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.template.name}</p>
                    <p className="text-xs text-slate-500">{task.zone.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(new Date(task.nextDue))}`}>
                    {formatDueDate(new Date(task.nextDue))}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{task.template.estimatedDuration} min</p>
                </div>
              </div>
            ))
          )}
          
          {tasks.length > 5 && (
            <div className="pt-3 border-t border-slate-100">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center group">
                View all upcoming tasks
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
