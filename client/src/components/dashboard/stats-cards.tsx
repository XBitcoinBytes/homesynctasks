import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  todayTasks: number;
  completed: number;
  overdue: number;
  activeMembers: number;
}

export function StatsCards({ todayTasks, completed, overdue, activeMembers }: StatsCardsProps) {
  const getEncouragingMessage = (todayTasks: number, completed: number, overdue: number) => {
    if (overdue === 0 && completed > 0) return "🎉 You're crushing it!";
    if (overdue > 0 && overdue <= 2) return "💪 Almost caught up!";
    if (todayTasks === 0) return "🏠 House is in great shape!";
    return "📋 Let's tackle today's tasks!";
  };

  return (
    <div className="silver-sprinkles">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="premium-card-sparkle p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-list-check text-blue-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{todayTasks}</p>
              <p className="text-xs text-slate-500 font-medium">Today's Focus</p>
            </div>
          </div>
        </Card>
        
        <Card className="premium-card-sparkle p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-check-circle text-emerald-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{completed}</p>
              <p className="text-xs text-slate-500 font-medium">Completed</p>
            </div>
          </div>
        </Card>
        
        <Card className={`premium-card-sparkle p-4 hover:scale-105 transition-transform duration-300 ${overdue > 0 ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : ''}`}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <i className={`fas ${overdue > 0 ? 'fa-exclamation-triangle' : 'fa-clock'} text-amber-600 text-lg`}></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{overdue}</p>
              <p className="text-xs text-slate-500 font-medium">Need Attention</p>
            </div>
          </div>
        </Card>
        
        <Card className="premium-card-sparkle p-4 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-users text-violet-600 text-lg"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeMembers}</p>
              <p className="text-xs text-slate-500 font-medium">Team Members</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold text-slate-700">
          {getEncouragingMessage(todayTasks, completed, overdue)}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Keeping your home maintained saves time and money long-term
        </p>
      </div>
    </div>
  );
}
