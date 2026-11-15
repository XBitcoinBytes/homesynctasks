import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function MobileNav() {
  const [location] = useLocation();
  const { appUser } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'fas fa-tachometer-alt' },
    { name: 'Tasks', href: '/task-library', icon: 'fas fa-tasks' },
    { name: 'Zones', href: '/rooms-zones', icon: 'fas fa-map-marker-alt' },
    { name: 'Schedule', href: '/schedule', icon: 'fas fa-calendar-alt' },
    { name: 'Settings', href: '/settings', icon: 'fas fa-cog' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!appUser) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-600">
            <i className="fas fa-bars text-lg"></i>
          </Button>
          <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text flex items-center gap-2">
            <span className="text-xl animate-pulse">₿</span>
            HomeSync Tasks
          </h1>
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials(appUser.name)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-5 py-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex flex-col items-center py-2 ${
                isActive ? 'text-orange-600' : 'text-slate-400'
              }`}>
                <i className={`${item.icon} text-lg`}></i>
                <span className="text-xs font-medium mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
