import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useHousehold } from '@/hooks/use-household';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { appUser, logout } = useAuth();
  const { household, members } = useHousehold();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    daily: true,
    weekly: true,
    critical: true,
    email: false,
    sms: true
  });

  const [profileData, setProfileData] = useState({
    name: appUser?.name || '',
    email: appUser?.email || '',
    phone: appUser?.phone || ''
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInviteGenerate = () => {
    toast({
      title: "Invite link copied",
      description: "The invite code has been copied to your clipboard.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!appUser || !household) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileNav />
        
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-600">
                Manage your account, household, and notification preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="household">Household</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <p className="text-sm text-slate-500">
                      Update your personal information and account settings
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-medium">
                          {getInitials(appUser.name)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{appUser.name}</h4>
                        <p className="text-sm text-slate-500">{appUser.email}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          value="Eastern Time (UTC-5)"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleProfileUpdate} className="bg-primary-600 hover:bg-primary-700">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="household" className="mt-6">
                <div className="space-y-6">
                  {/* Household Info */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Household Information</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">{household.name}</h4>
                          <p className="text-sm text-slate-500">
                            Created {new Date(household.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline">
                          <i className="fas fa-edit mr-2"></i>
                          Edit Name
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Invite Members */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Invite Members</h3>
                      <p className="text-sm text-slate-500">
                        Share this code with family members to join your household
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Label htmlFor="inviteCode">Invite Code</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="inviteCode"
                              value={household.inviteCode}
                              readOnly
                              className="font-mono"
                            />
                            <Button onClick={handleInviteGenerate}>
                              <i className="fas fa-copy"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Members */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Current Members</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {members.map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                ['bg-primary-600', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500'][index % 4]
                              }`}>
                                <span className="text-white text-sm font-medium">
                                  {getInitials(member.user.name)}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">{member.user.name}</h4>
                                <p className="text-sm text-slate-500">{member.user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                                {member.role}
                              </Badge>
                              {member.role !== 'admin' && (
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Notification Preferences</h3>
                    <p className="text-sm text-slate-500">
                      Choose how you want to be notified about tasks and household updates
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Task Notifications */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-4">Task Notifications</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Daily task reminders</p>
                            <p className="text-sm text-slate-500">Get notified about today's tasks each morning</p>
                          </div>
                          <Switch
                            checked={notifications.daily}
                            onCheckedChange={(checked) => handleNotificationChange('daily', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Weekly summaries</p>
                            <p className="text-sm text-slate-500">Weekly progress reports and upcoming tasks</p>
                          </div>
                          <Switch
                            checked={notifications.weekly}
                            onCheckedChange={(checked) => handleNotificationChange('weekly', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Critical task alerts</p>
                            <p className="text-sm text-slate-500">Important overdue tasks and maintenance reminders</p>
                          </div>
                          <Switch
                            checked={notifications.critical}
                            onCheckedChange={(checked) => handleNotificationChange('critical', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Delivery Methods */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-4">Delivery Methods</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Email notifications</p>
                            <p className="text-sm text-slate-500">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">SMS notifications</p>
                            <p className="text-sm text-slate-500">Receive text messages for important updates</p>
                          </div>
                          <Switch
                            checked={notifications.sms}
                            onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="mt-6">
                <div className="space-y-6">
                  {/* App Preferences */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">App Preferences</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Dark mode</p>
                          <p className="text-sm text-slate-500">Use dark theme for the interface</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Compact view</p>
                          <p className="text-sm text-slate-500">Show more content in less space</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Auto-complete recurring tasks</p>
                          <p className="text-sm text-slate-500">Automatically mark simple tasks as complete</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-red-200">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Leave household</p>
                          <p className="text-sm text-slate-500">Remove yourself from this household</p>
                        </div>
                        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                          Leave
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Delete account</p>
                          <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Sign out</p>
                          <p className="text-sm text-slate-500">Sign out of your account</p>
                        </div>
                        <Button variant="outline" onClick={logout}>
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
