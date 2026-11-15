import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Analytics() {
  // Mock analytics data - in real app this would come from Firebase
  const completionStats = {
    thisWeek: { completed: 23, total: 28, percentage: 82 },
    thisMonth: { completed: 89, total: 120, percentage: 74 },
    allTime: { completed: 450, total: 600, percentage: 75 }
  };

  const tasksByCategory = [
    { name: 'Cleaning', completed: 45, total: 60, color: '#3b82f6' },
    { name: 'Maintenance', completed: 12, total: 20, color: '#f59e0b' },
    { name: 'Yardwork', completed: 25, total: 30, color: '#10b981' },
    { name: 'Seasonal', completed: 7, total: 10, color: '#8b5cf6' }
  ];

  const weeklyProgress = [
    { day: 'Mon', tasks: 4, completed: 4 },
    { day: 'Tue', tasks: 6, completed: 5 },
    { day: 'Wed', tasks: 3, completed: 3 },
    { day: 'Thu', tasks: 5, completed: 4 },
    { day: 'Fri', tasks: 4, completed: 3 },
    { day: 'Sat', tasks: 3, completed: 2 },
    { day: 'Sun', tasks: 3, completed: 2 }
  ];

  const memberStats = [
    { name: 'John', completed: 28, assigned: 35, percentage: 80 },
    { name: 'Sarah', completed: 25, assigned: 30, percentage: 83 },
    { name: 'Mike', completed: 18, assigned: 25, percentage: 72 },
    { name: 'Emma', completed: 18, assigned: 20, percentage: 90 }
  ];

  const neglectedTasks = [
    { name: 'Clean gutters', zone: 'Outdoor', daysSince: 92, frequency: 'Every 6 months' },
    { name: 'Deep clean oven', zone: 'Kitchen', daysSince: 45, frequency: 'Monthly' },
    { name: 'Organize garage', zone: 'Garage', daysSince: 38, frequency: 'Monthly' },
    { name: 'Wash windows', zone: 'Living Room', daysSince: 35, frequency: 'Monthly' }
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
              <p className="text-slate-600">
                Track your household's task completion and productivity trends
              </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-slate-500">This Week</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {completionStats.thisWeek.completed}/{completionStats.thisWeek.total}
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      {completionStats.thisWeek.percentage}%
                    </Badge>
                  </div>
                  <Progress value={completionStats.thisWeek.percentage} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">Tasks completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-slate-500">This Month</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {completionStats.thisMonth.completed}/{completionStats.thisMonth.total}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {completionStats.thisMonth.percentage}%
                    </Badge>
                  </div>
                  <Progress value={completionStats.thisMonth.percentage} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">Tasks completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-slate-500">All Time</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {completionStats.allTime.completed}/{completionStats.allTime.total}
                    </span>
                    <Badge className="bg-violet-100 text-violet-800">
                      {completionStats.allTime.percentage}%
                    </Badge>
                  </div>
                  <Progress value={completionStats.allTime.percentage} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">Tasks completed</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Progress Chart */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Weekly Progress</h3>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                          <Bar dataKey="tasks" fill="#e2e8f0" name="Total" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Neglected Tasks */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Most Neglected Tasks</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {neglectedTasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-slate-900">{task.name}</h4>
                              <p className="text-sm text-slate-500">{task.zone} • {task.frequency}</p>
                            </div>
                            <Badge variant="destructive">
                              {task.daysSince} days
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution Pie Chart */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Task Distribution by Category</h3>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={tasksByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            label={({ name, percentage }) => `${name} ${(percentage || 0).toFixed(0)}%`}
                          >
                            {tasksByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Completion Stats */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Category Completion Rates</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tasksByCategory.map((category, index) => {
                          const percentage = Math.round((category.completed / category.total) * 100);
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                  <span className="font-medium text-slate-900">{category.name}</span>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {category.completed}/{category.total} ({percentage}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Member Performance</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {memberStats.map((member, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                ['bg-primary-600', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'][index]
                              }`}>
                                <span className="text-white font-medium text-sm">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <h4 className="font-medium text-slate-900">{member.name}</h4>
                            </div>
                            <Badge className={
                              member.percentage >= 85 ? 'bg-emerald-100 text-emerald-800' :
                              member.percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {member.percentage}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Completed</span>
                              <span className="font-medium">{member.completed}/{member.assigned}</span>
                            </div>
                            <Progress value={member.percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Completion Trends</h3>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="completed" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Completed Tasks"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tasks" 
                          stroke="#e2e8f0" 
                          strokeWidth={2}
                          name="Total Tasks"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
