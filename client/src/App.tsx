import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useHousehold } from "@/hooks/use-household";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Setup from "@/pages/setup";
import Dashboard from "@/pages/dashboard";
import TaskLibrary from "@/pages/task-library";
import RoomsZones from "@/pages/rooms-zones";
import Schedule from "@/pages/schedule";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import InvitePage from "@/pages/invite";

function Router() {
  const { user, loading: authLoading } = useAuth();
  const { household, loading: householdLoading } = useHousehold();

  // Check for invitation link first
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCode = urlParams.get('invite');
  if (inviteCode) {
    return <InvitePage />;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-home text-white text-xl"></i>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading HomeSync...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Show loading state while checking household
  if (householdLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-home text-white text-xl"></i>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Setting up your household...</p>
        </div>
      </div>
    );
  }

  // If authenticated but no household, show household setup
  if (!household) {
    return <AuthPage />;
  }

  // User is authenticated and has a household, show main app
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/setup" component={Setup} />
      <Route path="/task-library" component={TaskLibrary} />
      <Route path="/rooms-zones" component={RoomsZones} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
