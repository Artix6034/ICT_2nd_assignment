import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTrading } from '../../contexts/TradingContext';
import { TrendingUp, TrendingDown, Plus, X, Star } from 'lucide-react';
import { cn } from '../ui/utils';

interface DashboardProps {
  onNavigateToTrading: (symbol?: string) => void;
}

export function Dashboard({ onNavigateToTrading }: DashboardProps) {
  const { 
    user, 
    assets, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    totalValue, 
    totalPnL,
    positions
  } = useTrading();

  const watchlistedAssets = assets.filter(asset => watchlist.includes(asset.symbol));
  const trendingAssets = assets
    .filter(asset => !watchlist.includes(asset.symbol))
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 4);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC' || symbol === 'ETH') {
      return `$${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your investments today.</p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Account Balance</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(user?.balance || 0)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Value</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalValue)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total P&L</CardDescription>
            <CardTitle className={cn(
              "text-2xl flex items-center gap-2",
              totalPnL >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {totalPnL >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {formatCurrency(Math.abs(totalPnL))}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Holdings</CardDescription>
            <CardTitle className="text-2xl">{positions.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Watchlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Watchlist
          </CardTitle>
          <CardDescription>
            Track your favorite assets and market movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {watchlistedAssets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
              <Button variant="outline" onClick={() => addToWatchlist('AAPL')}>
                Add Some Assets
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlistedAssets.map(asset => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onNavigateToTrading(asset.symbol)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-sm">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{asset.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <Badge variant={asset.type === 'crypto' ? 'secondary' : 'outline'}>
                      {asset.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(asset.price, asset.symbol)}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        asset.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(asset.symbol);
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Assets
          </CardTitle>
          <CardDescription>
            Most volatile assets in the market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingAssets.map(asset => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onNavigateToTrading(asset.symbol)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-xs">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{asset.symbol}</h4>
                    <p className="text-xs text-muted-foreground">{formatPrice(asset.price, asset.symbol)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    asset.change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {asset.changePercent.toFixed(1)}%
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWatchlist(asset.symbol);
                    }}
                    className="hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}