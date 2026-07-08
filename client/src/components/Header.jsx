import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="JobTracker Logo" className="w-8 h-8 object-contain mix-blend-multiply dark:invert dark:mix-blend-screen" />
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JobTracker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Welcome,</span>
              <span className="font-medium text-foreground">{user?.name}</span>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
