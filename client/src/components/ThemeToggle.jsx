import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-8 w-8 rounded-lg border-border/50 bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-300"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={`w-4 h-4 absolute transition-all duration-300 text-amber-500 ${
          theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all duration-300 text-indigo-400 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
