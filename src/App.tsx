import React, { useState } from 'react';
import { TradingProvider, useTrading } from './contexts/TradingContext';
import { Navigation } from './components/Navigation';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dashboard } from './components/screens/Dashboard';
import { Trading } from './components/screens/Trading';
import { Portfolio } from './components/screens/Portfolio';
import { Settings } from './components/screens/Settings';
import { Toaster } from './components/ui/sonner';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated } = useTrading();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedTradingSymbol, setSelectedTradingSymbol] = useState<string | undefined>();

  const handleNavigateToTrading = (symbol?: string) => {
    setSelectedTradingSymbol(symbol);
    setCurrentScreen('trading');
  };

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
    if (screen !== 'trading') {
      setSelectedTradingSymbol(undefined);
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigateToTrading={handleNavigateToTrading} />;
      case 'trading':
        return <Trading selectedSymbol={selectedTradingSymbol} />;
      case 'portfolio':
        return <Portfolio onNavigateToTrading={handleNavigateToTrading} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigateToTrading={handleNavigateToTrading} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation 
        currentScreen={currentScreen} 
        onScreenChange={handleScreenChange}
        className="hidden md:flex"
      />
      
      {/* Mobile Navigation - Simplified for demo */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-50">
        <div className="flex justify-around">
          {['dashboard', 'trading', 'portfolio', 'settings'].map((screen) => (
            <button
              key={screen}
              onClick={() => handleScreenChange(screen)}
              className={`p-2 rounded-lg capitalize ${
                currentScreen === screen 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              {screen}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {renderCurrentScreen()}
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <TradingProvider>
      <MainApp />
    </TradingProvider>
  );
}