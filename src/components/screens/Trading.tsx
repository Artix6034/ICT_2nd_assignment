import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { useTrading } from '../../contexts/TradingContext';
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

interface TradingProps {
  selectedSymbol?: string;
}

export function Trading({ selectedSymbol }: TradingProps) {
  const { 
    assets, 
    user, 
    executeTrade, 
    addToWatchlist, 
    removeFromWatchlist, 
    watchlist 
  } = useTrading();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(
    selectedSymbol ? assets.find(a => a.symbol === selectedSymbol) : null
  );
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState('');

  // Update selected asset when selectedSymbol prop changes
  useEffect(() => {
    if (selectedSymbol) {
      const asset = assets.find(a => a.symbol === selectedSymbol);
      if (asset) {
        setSelectedAsset(asset);
      }
    }
  }, [selectedSymbol, assets]);

  // Update selected asset price in real-time
  useEffect(() => {
    if (selectedAsset) {
      const updatedAsset = assets.find(a => a.symbol === selectedAsset.symbol);
      if (updatedAsset) {
        setSelectedAsset(updatedAsset);
      }
    }
  }, [assets, selectedAsset]);

  const filteredAssets = assets.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = () => {
    if (!selectedAsset || !quantity) return 0;
    return parseFloat(quantity) * selectedAsset.price;
  };

  const handleTrade = () => {
    if (!selectedAsset || !quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    const total = calculateTotal();
    if (tradeType === 'buy' && total > (user?.balance || 0)) {
      setError('Insufficient funds');
      return;
    }

    setError('');
    setShowConfirmDialog(true);
  };

  const confirmTrade = () => {
    if (!selectedAsset || !quantity) return;

    const success = executeTrade(
      selectedAsset.symbol,
      tradeType,
      parseFloat(quantity),
      selectedAsset.price
    );

    if (success) {
      toast.success(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${selectedAsset.symbol}!`);
      setQuantity('');
      setShowConfirmDialog(false);
    } else {
      toast.error('Trade failed. Please try again.');
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Trading</h1>
          <p className="text-muted-foreground">Buy and sell assets in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Search & Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Asset</CardTitle>
            <CardDescription>Search and select an asset to trade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50",
                    selectedAsset?.symbol === asset.symbol && "bg-accent border-primary"
                  )}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-xs">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{asset.symbol}</h4>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(asset.price, asset.symbol)}</p>
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        asset.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {asset.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {asset.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Place Order</span>
              {selectedAsset && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (watchlist.includes(selectedAsset.symbol)) {
                      removeFromWatchlist(selectedAsset.symbol);
                      toast.success(`Removed ${selectedAsset.symbol} from watchlist`);
                    } else {
                      addToWatchlist(selectedAsset.symbol);
                      toast.success(`Added ${selectedAsset.symbol} to watchlist`);
                    }
                  }}
                  className={cn(
                    "hover:text-primary",
                    watchlist.includes(selectedAsset.symbol) && "text-yellow-500"
                  )}
                >
                  <Star className={cn(
                    "h-4 w-4",
                    watchlist.includes(selectedAsset.symbol) && "fill-current"
                  )} />
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {selectedAsset ? `Trading ${selectedAsset.name}` : 'Select an asset to start trading'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedAsset ? (
              <>
                {/* Asset Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">{selectedAsset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedAsset.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{selectedAsset.name}</p>
                      </div>
                      <Badge variant={selectedAsset.type === 'crypto' ? 'secondary' : 'outline'}>
                        {selectedAsset.type}
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-semibold">{formatPrice(selectedAsset.price, selectedAsset.symbol)}</p>
                      <div className={cn(
                        "flex items-center gap-1",
                        selectedAsset.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {selectedAsset.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)} ({selectedAsset.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <Select value={tradeType} onValueChange={(value: 'buy' | 'sell') => setTradeType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0"
                      step="any"
                    />
                  </div>

                  {quantity && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex justify-between text-sm">
                        <span>Price per unit:</span>
                        <span>{formatPrice(selectedAsset.price, selectedAsset.symbol)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity:</span>
                        <span>{quantity} {selectedAsset.symbol}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      onClick={() => {
                        setTradeType('buy');
                        handleTrade();
                      }}
                      disabled={!quantity || parseFloat(quantity) <= 0}
                    >
                      Buy {selectedAsset.symbol}
                    </Button>
                    <Button
                      className="flex-1"
                      variant={tradeType === 'sell' ? 'destructive' : 'outline'}
                      onClick={() => {
                        setTradeType('sell');
                        handleTrade();
                      }}
                      disabled={!quantity || parseFloat(quantity) <= 0}
                    >
                      Sell {selectedAsset.symbol}
                    </Button>
                  </div>
                </div>

                {/* Account Balance */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span>Available Balance:</span>
                    <span className="font-semibold">{formatCurrency(user?.balance || 0)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Select an asset from the list to start trading</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Trade</DialogTitle>
            <DialogDescription>
              Please review your order details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between text-sm mb-2">
                  <span>Asset:</span>
                  <span className="font-medium">{selectedAsset.symbol} - {selectedAsset.name}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Order Type:</span>
                  <span className={cn(
                    "font-medium capitalize",
                    tradeType === 'buy' ? "text-green-600" : "text-red-600"
                  )}>
                    {tradeType}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Price per unit:</span>
                  <span className="font-medium">{formatPrice(selectedAsset.price, selectedAsset.symbol)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmTrade}
              variant={tradeType === 'buy' ? 'default' : 'destructive'}
            >
              Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}