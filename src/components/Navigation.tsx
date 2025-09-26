import React from 'react';
import { cn } from './ui/utils';
import { Home, TrendingUp, Briefcase, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useTrading } from '../contexts/TradingContext';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
  className?: string;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'trading', label: 'Trading', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({ currentScreen, onScreenChange, className }: NavigationProps) {
  const { logout } = useTrading();

  return (
    <nav className={cn(
      "bg-card border-r border-border h-full w-64 p-4 flex flex-col",
      className
    )}>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-primary">TradePro</h1>
        <p className="text-sm text-muted-foreground">Professional Trading</p>
      </div>

      <div className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 transition-all duration-200",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => onScreenChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="border-t border-border pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}