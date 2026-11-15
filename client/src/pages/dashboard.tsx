import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { TodaysTasks } from '@/components/dashboard/todays-tasks';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import { HouseholdMembers } from '@/components/dashboard/household-members';

import { InviteMemberModal } from '@/components/dashboard/invite-member-modal';
import { AddTaskModal } from '@/components/tasks/add-task-modal';
import { AddZoneModal } from '@/components/zones/add-zone-modal';
import { useAuth } from '@/hooks/use-auth';
import { useHousehold } from '@/hooks/use-household';
import { useLocation } from 'wouter';

// Mock data for demonstration
const mockTodaysTasks = [
  {
    id: 1,
    template: { id: 1, name: 'Clean gutters', category: 'maintenance', estimatedDuration: 45 },
    zone: { id: 1, name: 'Outdoor', type: 'outdoor' },
    nextDue: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    assignedUser: { id: 1, name: 'John' },
    isActive: true,
    householdId: 1,
    templateId: 1,
    zoneId: 1,
    assignedTo: 1,
    frequency: 'every 6 months',
    createdBy: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    template: { id: 2, name: 'Vacuum living room', category: 'cleaning', estimatedDuration: 20 },
    zone: { id: 2, name: 'Living Room', type: 'indoor' },
    nextDue: new Date(),
    assignedUser: { id: 2, name: 'Sarah' },
    isActive: true,
    householdId: 1,
    templateId: 2,
    zoneId: 2,
    assignedTo: 2,
    frequency: 'weekly',
    createdBy: 1,
    createdAt: new Date(),
  },
];

const mockUpcomingTasks = [
  {
    id: 3,
    template: { id: 3, name: 'Change furnace filter', category: 'maintenance', estimatedDuration: 30 },
    zone: { id: 3, name: 'Basement', type: 'indoor' },
    nextDue: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    isActive: true,
    householdId: 1,
    templateId: 3,
    zoneId: 3,
    frequency: 'every 3 months',
    createdBy: 1,
    createdAt: new Date(),
  },
];

export default function Dashboard() {
  const { appUser } = useAuth();
  const { household, members } = useHousehold();
  const [, setLocation] = useLocation();
  const [tasks, setTasks] = useState(mockTodaysTasks);
  const [upcomingTasks] = useState(mockUpcomingTasks);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  const stats = {
    todayTasks: tasks.length,
    completed: tasks.filter(t => t.lastCompleted && 
      new Date(t.lastCompleted).toDateString() === new Date().toDateString()).length,
    overdue: tasks.filter(t => new Date(t.nextDue) < new Date()).length,
    activeMembers: members.length,
  };

  const handleTaskComplete = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, lastCompleted: new Date() }
        : task
    ));
  };

  const handleTaskUpdate = (updatedTask: any) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (!appUser || !household) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden silver-sprinkles">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 border-2 border-purple-200 shadow-2xl backdrop-blur-sm interactive-depth relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect opacity-30"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text mb-4 flex items-center relative z-10">
                <span className="mr-4 text-5xl floating">🏡</span>
                {getGreeting()}, {appUser.name.split(' ')[0]}!
              </h1>
              <p className="text-xl text-purple-700 mb-6 font-medium relative z-10">
                Your intelligent home companion - transforming maintenance into magic
              </p>
              <div className="flex flex-wrap items-center gap-8 text-base relative z-10">
                <div className="flex items-center bg-emerald-100 px-4 py-2 rounded-full interactive-depth">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                  <span className="text-emerald-700 font-semibold">Smart scheduling saves time</span>
                </div>
                <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full interactive-depth">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                  <span className="text-blue-700 font-semibold">Prevent costly repairs</span>
                </div>
                <div className="flex items-center bg-amber-100 px-4 py-2 rounded-full interactive-depth">
                  <span className="w-3 h-3 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
                  <span className="text-amber-700 font-semibold">Maintain home value</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="group px-8 py-4 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-2 glow-effect relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-effect opacity-20"></div>
                <span className="text-2xl group-hover:animate-spin relative z-10">⚡</span>
                <span className="text-lg relative z-10">Add New Task</span>
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-2 glow-effect relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-effect opacity-20"></div>
                <span className="text-2xl group-hover:animate-bounce relative z-10">👥</span>
                <span className="text-lg relative z-10">Invite Member</span>
              </button>
              <button
                onClick={() => setShowAddZoneModal(true)}
                className="group px-8 py-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-2 glow-effect relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-effect opacity-20"></div>
                <span className="text-2xl group-hover:animate-pulse relative z-10">🏠</span>
                <span className="text-lg relative z-10">Add Zone</span>
              </button>
              <button
                onClick={() => setLocation('/analytics')}
                className="group px-8 py-4 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-2 glow-effect relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer-effect opacity-20"></div>
                <span className="text-2xl group-hover:animate-pulse relative z-10">📊</span>
                <span className="text-lg relative z-10">View Analytics</span>
              </button>
            </div>

            {/* Stats Cards */}
            <StatsCards {...stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Today's Tasks */}
              <div className="lg:col-span-2">
                <TodaysTasks
                  tasks={tasks as any}
                  onTaskComplete={handleTaskComplete}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <HouseholdMembers
                  members={members}
                  onInviteMember={() => setShowInviteModal(true)}
                />
                
                <UpcomingTasks tasks={upcomingTasks as any} />
              </div>
            </div>
            
            {/* Smart Tips Section */}
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 border-2 border-cyan-200 shadow-2xl card-3d relative overflow-hidden">
              <div className="absolute inset-0 shimmer-effect opacity-20"></div>
              <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text mb-6 flex items-center relative z-10">
                <span className="mr-3 text-3xl floating">💎</span>
                Smart Homeowner Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200 shadow-lg interactive-depth">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3 floating">🛠️</span>
                    <strong className="text-emerald-700 text-lg">Preventive Maintenance</strong>
                  </div>
                  <p className="text-emerald-600 font-medium">Regular upkeep costs 10x less than emergency repairs</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-blue-200 shadow-lg interactive-depth">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3 floating">🌦️</span>
                    <strong className="text-blue-700 text-lg">Seasonal Preparation</strong>
                  </div>
                  <p className="text-blue-600 font-medium">Weather-ready homes avoid 80% of storm damage</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-200 shadow-lg interactive-depth">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3 floating">💰</span>
                    <strong className="text-amber-700 text-lg">Property Value</strong>
                  </div>
                  <p className="text-amber-600 font-medium">Well-maintained homes retain 15% more value</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <InviteMemberModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
      />
      
      <AddTaskModal 
        isOpen={showAddTaskModal} 
        onClose={() => setShowAddTaskModal(false)}
        onTaskAdded={() => {
          setShowAddTaskModal(false);
          // Refresh tasks or add to local state
        }}
      />
      
      <AddZoneModal 
        isOpen={showAddZoneModal} 
        onClose={() => setShowAddZoneModal(false)}
        onZoneAdded={() => {
          setShowAddZoneModal(false);
          // Refresh zones or add to local state
        }}
      />
    </div>
  );
}
