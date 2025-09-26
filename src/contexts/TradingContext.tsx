import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto';
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: 'stock' | 'crypto';
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
}

interface TradingContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  
  // Assets and watchlist
  assets: Asset[];
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  
  // Portfolio
  positions: Position[];
  orders: Order[];
  totalValue: number;
  totalPnL: number;
  
  // Trading
  executeTrade: (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) => boolean;
  
  // Settings
  updateUserProfile: (updates: Partial<User>) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Mock data
const MOCK_ASSETS: Asset[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 185.23, change: 2.45, changePercent: 1.34, type: 'stock' },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.45, change: -1.23, changePercent: -0.88, type: 'stock' },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.12, change: 5.67, changePercent: 1.52, type: 'stock' },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', price: 245.89, change: -8.45, changePercent: -3.32, type: 'stock' },
  { id: '5', symbol: 'BTC', name: 'Bitcoin', price: 67234.56, change: 1234.67, changePercent: 1.87, type: 'crypto' },
  { id: '6', symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -123.45, changePercent: -3.45, type: 'crypto' },
  { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.43, change: 23.45, changePercent: 2.75, type: 'stock' },
  { id: '8', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 156.78, change: 3.21, changePercent: 2.09, type: 'stock' },
];

const MOCK_USER: User = {
  id: '1',
  email: 'trader@example.com',
  name: 'John Trader',
  balance: 50000,
};

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'BTC', 'GOOGL']);
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgPrice: 180.50, currentPrice: 185.23, type: 'stock' },
    { id: '2', symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, avgPrice: 65000, currentPrice: 67234.56, type: 'crypto' },
    { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, avgPrice: 370.00, currentPrice: 378.12, type: 'stock' },
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 10,
      price: 180.50,
      total: 1805.00,
      timestamp: new Date(Date.now() - 86400000),
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'BTC',
      type: 'buy',
      quantity: 0.5,
      price: 65000,
      total: 32500,
      timestamp: new Date(Date.now() - 172800000),
      status: 'completed'
    },
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const volatility = asset.type === 'crypto' ? 0.02 : 0.01;
        const change = (Math.random() - 0.5) * asset.price * volatility;
        const newPrice = Math.max(asset.price + change, 0.01);
        const priceChange = newPrice - asset.price;
        const changePercent = (priceChange / asset.price) * 100;
        
        return {
          ...asset,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
        };
      }));
      
      // Update positions with new current prices
      setPositions(prev => prev.map(position => {
        const asset = assets.find(a => a.symbol === position.symbol);
        if (asset) {
          return { ...position, currentPrice: asset.price };
        }
        return position;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [assets]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email && password) {
      setUser(MOCK_USER);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup
    if (email && password && name) {
      const newUser = { ...MOCK_USER, email, name };
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  const executeTrade = (symbol: string, type: 'buy' | 'sell', quantity: number, price: number): boolean => {
    if (!user) return false;
    
    const total = quantity * price;
    
    if (type === 'buy' && user.balance < total) {
      return false; // Insufficient funds
    }

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      symbol,
      type,
      quantity,
      price,
      total,
      timestamp: new Date(),
      status: 'completed'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update user balance
    setUser(prev => prev ? {
      ...prev,
      balance: type === 'buy' ? prev.balance - total : prev.balance + total
    } : null);

    // Update positions
    setPositions(prev => {
      const existingPosition = prev.find(p => p.symbol === symbol);
      const asset = assets.find(a => a.symbol === symbol);
      
      if (!asset) return prev;

      if (existingPosition) {
        if (type === 'buy') {
          const newQuantity = existingPosition.quantity + quantity;
          const newAvgPrice = ((existingPosition.avgPrice * existingPosition.quantity) + total) / newQuantity;
          return prev.map(p => 
            p.symbol === symbol 
              ? { ...p, quantity: newQuantity, avgPrice: newAvgPrice }
              : p
          );
        } else {
          const newQuantity = Math.max(0, existingPosition.quantity - quantity);
          if (newQuantity === 0) {
            return prev.filter(p => p.symbol !== symbol);
          }
          return prev.map(p => 
            p.symbol === symbol 
              ? { ...p, quantity: newQuantity }
              : p
          );
        }
      } else if (type === 'buy') {
        return [...prev, {
          id: Date.now().toString(),
          symbol,
          name: asset.name,
          quantity,
          avgPrice: price,
          currentPrice: price,
          type: asset.type
        }];
      }
      
      return prev;
    });

    return true;
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  // Calculate portfolio metrics
  const totalValue = positions.reduce((sum, position) => 
    sum + (position.quantity * position.currentPrice), 0
  );

  const totalPnL = positions.reduce((sum, position) => 
    sum + (position.quantity * (position.currentPrice - position.avgPrice)), 0
  );

  const value: TradingContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    assets,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    positions,
    orders,
    totalValue,
    totalPnL,
    executeTrade,
    updateUserProfile,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}