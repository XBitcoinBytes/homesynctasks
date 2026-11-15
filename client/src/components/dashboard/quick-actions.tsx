import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddTask: () => void;
  onAddRoom: () => void;
  onInviteMember: () => void;
  onViewAnalytics: () => void;
}

export function QuickActions({ onAddTask, onAddRoom, onInviteMember, onViewAnalytics }: QuickActionsProps) {
  const actionItems = [
    {
      emoji: "⚡",
      title: "Add New Task",
      subtitle: "Create room-specific household tasks",
      onClick: onAddTask,
      color: "from-orange-500 to-amber-500",
      glow: "shadow-orange-300"
    },
    {
      emoji: "🏠",
      title: "Add Zone",
      subtitle: "Add rooms and areas to organize tasks",
      onClick: onAddRoom,
      color: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-300"
    },
    {
      emoji: "👥",
      title: "Invite Member",
      subtitle: "Share household tasks with family",
      onClick: onInviteMember,
      color: "from-green-500 to-emerald-500",
      glow: "shadow-green-300"
    },
    {
      emoji: "📊",
      title: "View Analytics",
      subtitle: "Track your household's progress",
      onClick: onViewAnalytics,
      color: "from-purple-500 to-violet-500",
      glow: "shadow-purple-300"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-4 border-orange-300 shadow-2xl">
      <CardHeader className="p-6 border-b-4 border-orange-200 bg-gradient-to-r from-orange-100 to-amber-100">
        <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text flex items-center">
          <span className="mr-3 text-3xl animate-pulse">₿</span>
          Quick Actions
        </h3>
        <p className="text-lg text-orange-700 font-semibold mt-2">Streamline your household management</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actionItems.map((item, index) => (
            <Button
              key={index}
              className={`h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${item.color} hover:scale-105 transform transition-all duration-200 text-white font-bold border-3 border-white/30 shadow-xl ${item.glow}`}
              onClick={item.onClick}
            >
              <div className="text-4xl animate-bounce">{item.emoji}</div>
              <div className="text-center">
                <div className="font-bold text-lg">{item.title}</div>
                <div className="text-sm opacity-90">{item.subtitle}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border-3 border-orange-300">
          <p className="text-sm text-orange-800 text-center font-bold">
            <span className="text-xl mr-2">💡</span>
            Pro Tip: Complete tasks consistently to maintain a well-organized household!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
