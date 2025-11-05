// Mock market data for testing
const mockPrices = {
  'BTC': { base: 45000, name: 'Bitcoin' },
  'ETH': { base: 2800, name: 'Ethereum' },
  'AAPL': { base: 178, name: 'Apple Inc.' },
  'GOOGL': { base: 142, name: 'Alphabet Inc.' },
  'TSLA': { base: 245, name: 'Tesla Inc.' },
  'MSFT': { base: 378, name: 'Microsoft Corp.' },
  'AMZN': { base: 155, name: 'Amazon.com Inc.' },
  'NFLX': { base: 485, name: 'Netflix Inc.' },
  'META': { base: 355, name: 'Meta Platforms' },
  'NVDA': { base: 495, name: 'NVIDIA Corp.' }
};

// Store last prices for change calculation
const lastPrices = {};

// Generate realistic price with volatility
function generatePrice(symbol) {
  const data = mockPrices[symbol];
  if (!data) return null;

  const volatility = symbol.length === 3 && symbol !== 'BTC' && symbol !== 'ETH' 
    ? 0.02  // 2% volatility for stocks
    : 0.05; // 5% volatility for crypto

  const change = (Math.random() - 0.5) * data.base * volatility;
  const price = data.base + change;
  
  return {
    symbol,
    name: data.name,
    price: parseFloat(price.toFixed(2)),
    basePrice: data.base
  };
}

// Get current market price
async function getMarketPrice(symbol) {
  const data = generatePrice(symbol.toUpperCase());
  return data ? data.price : null;
}

// Get detailed market data
async function getMarketData(symbol) {
  const data = generatePrice(symbol.toUpperCase());
  if (!data) return null;

  const lastPrice = lastPrices[symbol] || data.price;
  const change = data.price - lastPrice;
  const changePercent = lastPrice > 0 ? (change / lastPrice) * 100 : 0;

  // Update last price
  lastPrices[symbol] = data.price;

  const dayHigh = data.price * (1 + Math.random() * 0.03);
  const dayLow = data.price * (1 - Math.random() * 0.03);
  const volume = Math.floor(Math.random() * 10000000) + 1000000;

  return {
    symbol: data.symbol,
    name: data.name,
    price: data.price,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    dayHigh: parseFloat(dayHigh.toFixed(2)),
    dayLow: parseFloat(dayLow.toFixed(2)),
    volume,
    marketCap: data.price * volume * 1000,
    timestamp: new Date().toISOString()
  };
}

// Get top gainers
async function getTopGainers() {
  const symbols = Object.keys(mockPrices);
  const data = await Promise.all(
    symbols.map(symbol => getMarketData(symbol))
  );

  return data
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
}

// Get top losers
async function getTopLosers() {
  const symbols = Object.keys(mockPrices);
  const data = await Promise.all(
    symbols.map(symbol => getMarketData(symbol))
  );

  return data
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
}

// Get trending symbols
async function getTrendingSymbols() {
  const trending = ['BTC', 'ETH', 'AAPL', 'TSLA', 'NVDA'];
  return await Promise.all(
    trending.map(symbol => getMarketData(symbol))
  );
}

module.exports = {
  getMarketPrice,
  getMarketData,
  getTopGainers,
  getTopLosers,
  getTrendingSymbols
};
