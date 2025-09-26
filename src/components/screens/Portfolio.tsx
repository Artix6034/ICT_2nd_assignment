import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useTrading } from '../../contexts/TradingContext';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Briefcase, Clock } from 'lucide-react';
import { cn } from '../ui/utils';

interface PortfolioProps {
  onNavigateToTrading: (symbol?: string) => void;
}

export function Portfolio({ onNavigateToTrading }: PortfolioProps) {
  const { positions, orders, totalValue, totalPnL, user } = useTrading();
  const [selectedTab, setSelectedTab] = useState('holdings');

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePositionPnL = (position: any) => {
    return position.quantity * (position.currentPrice - position.avgPrice);
  };

  const calculatePositionPnLPercent = (position: any) => {
    return ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
  };

  const totalInvested = positions.reduce((sum, position) => 
    sum + (position.quantity * position.avgPrice), 0
  );

  const recentOrders = orders.slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Portfolio</h1>
          <p className="text-muted-foreground">Track your investments and trading history</p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Value
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalValue)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Invested
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalInvested)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              {totalPnL >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              Unrealized P&L
            </CardDescription>
            <CardTitle className={cn(
              "text-2xl",
              totalPnL >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Holdings
            </CardDescription>
            <CardTitle className="text-2xl">{positions.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Holdings</CardTitle>
              <CardDescription>
                Your current asset positions and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You don't have any holdings yet</p>
                  <Button onClick={() => onNavigateToTrading()}>
                    Start Trading
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map(position => {
                    const positionPnL = calculatePositionPnL(position);
                    const positionPnLPercent = calculatePositionPnLPercent(position);
                    const marketValue = position.quantity * position.currentPrice;
                    
                    return (
                      <div
                        key={position.id}
                        className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => onNavigateToTrading(position.symbol)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold">{position.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{position.symbol}</h3>
                              <p className="text-sm text-muted-foreground">{position.name}</p>
                              <Badge variant={position.type === 'crypto' ? 'secondary' : 'outline'} className="mt-1">
                                {position.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div>
                              <p className="font-semibold">{formatCurrency(marketValue)}</p>
                              <p className="text-sm text-muted-foreground">
                                {position.quantity} @ {formatCurrency(position.currentPrice)}
                              </p>
                            </div>
                            
                            <div className={cn(
                              "text-sm flex items-center gap-1 justify-end",
                              positionPnL >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {positionPnL >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {positionPnL >= 0 ? '+' : ''}{formatCurrency(positionPnL)} ({positionPnLPercent.toFixed(2)}%)
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              Avg: {formatCurrency(position.avgPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Your recent trading activity and order details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No trading history yet</p>
                  <Button onClick={() => onNavigateToTrading()}>
                    Place Your First Order
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-xs">{order.symbol.slice(0, 2)}</span>
                            </div>
                            <span className="font-medium">{order.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.type === 'buy' ? 'default' : 'destructive'}>
                            {order.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{formatCurrency(order.price)}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(order.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' : 'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}