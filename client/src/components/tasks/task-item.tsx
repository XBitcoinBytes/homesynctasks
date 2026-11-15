import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Task, TaskTemplate, Zone, User } from '@shared/schema';
import { format, differenceInDays, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task & { template: TaskTemplate; zone: Zone; assignedUser?: User };
  onComplete: () => void;
  onUpdate: (task: Task) => void;
}

export function TaskItem({ task, onComplete, onUpdate }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const isOverdue = isPast(new Date(task.nextDue));
  const isCompleted = !!task.lastCompleted && 
    differenceInDays(new Date(), new Date(task.lastCompleted)) === 0;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const getOverdueDays = () => {
    if (!isOverdue) return 0;
    return differenceInDays(new Date(), new Date(task.nextDue));
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
    }
    if (isOverdue) {
      const days = getOverdueDays();
      return <Badge variant="destructive">{days} days overdue</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Due today</Badge>;
  };

  return (
    <div className={`flex items-center p-4 rounded-lg border ${
      isOverdue ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-center flex-1">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleComplete}
          disabled={isCompleting}
          className={`w-5 h-5 ${isOverdue ? 'border-red-300' : 'border-slate-300'}`}
        />
        <div className="ml-4 flex-1">
          <h3 className={`font-medium ${
            isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}>
            {task.template.name}
          </h3>
          <p className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
            {task.zone.name} • {task.template.category}
          </p>
          <div className="flex items-center mt-1 space-x-2">
            {getStatusBadge()}
            <span className="text-xs text-slate-400">
              {task.assignedUser 
                ? `Assigned to: ${task.assignedUser.name}`
                : isCompleted 
                  ? `Completed by: ${task.assignedUser?.name || 'Unknown'}`
                  : 'Unassigned'
              }
            </span>
          </div>
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-2">
        <span className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
          ~{task.template.estimatedDuration} min
        </span>
        {!isCompleted && (
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-ellipsis-v"></i>
          </Button>
        )}
      </div>
    </div>
  );
}
