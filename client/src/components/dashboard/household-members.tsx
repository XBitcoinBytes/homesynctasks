import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HouseholdMember, User } from '@shared/schema';

interface HouseholdMembersProps {
  members: (HouseholdMember & { user: User })[];
  onInviteMember: () => void;
}

export function HouseholdMembers({ members, onInviteMember }: HouseholdMembersProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    'bg-primary-600',
    'bg-pink-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-emerald-500',
    'bg-blue-500',
  ];

  return (
    <Card>
      <CardHeader className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Household Members</h3>
          <Button variant="ghost" size="sm" onClick={onInviteMember} className="text-primary-600 hover:text-primary-700">
            <i className="fas fa-user-plus"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {members.map((member, index) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-medium">
                    {getInitials(member.user.name)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{member.user.name}</p>
                  <p className="text-xs text-slate-500">
                    {/* This would be calculated from tasks */}
                    {Math.floor(Math.random() * 5)} tasks today
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
