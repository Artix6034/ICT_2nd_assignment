Trading System Backend (PostgreSQL)
Complete backend API for a trading system with real-time market data, portfolio management, and user authentication using PostgreSQL and Sequelize ORM.

🚀 Features
JWT Authentication - Secure user registration, login, and session management
Trading Operations - Execute buy/sell orders with ACID transactions
Portfolio Management - Track holdings, profit/loss, and performance
Real-time Market Data - WebSocket support for live price updates
User Settings - Customizable preferences and API key management
Mock Market Data - Built-in mock data for testing (stocks & crypto)
PostgreSQL Database - Relational database with transaction support
Input Validation - Comprehensive request validation
Error Handling - Centralized error handling and logging
📁 Project Structure
backend/
├── server.js                 # Main application entry point
├── config/
│   └── db.js                # PostgreSQL connection (Sequelize)
├── models/
│   ├── index.js             # Model associations
│   ├── User.js              # User model
│   ├── Trade.js             # Trade model
│   ├── Portfolio.js         # Portfolio & Asset models
│   └── ApiKey.js            # API Key model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── tradeRoutes.js       # Trading routes
│   ├── portfolioRoutes.js   # Portfolio routes
│   ├── marketRoutes.js      # Market data routes
│   └── settingsRoutes.js    # Settings routes
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── tradeController.js   # Trading logic (with transactions)
│   ├── portfolioController.js
│   ├── marketController.js
│   └── settingsController.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Input validation
├── utils/
│   ├── marketData.js        # Mock market data generator
│   └── websocket.js         # WebSocket handler
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
🛠️ Installation
Prerequisites
Node.js (v14 or higher)
PostgreSQL (v12 or higher)
npm or yarn
Step 1: Install PostgreSQL
macOS (with Homebrew):

bash
brew install postgresql@15
brew services start postgresql@15
Ubuntu/Debian:

bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
Windows: Download and install from postgresql.org

Step 2: Create Database
bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE trading_system;

# Create user (optional)
CREATE USER trading_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trading_system TO trading_user;

# Exit
\q
Step 3: Install Dependencies
bash
# Install Node.js dependencies
npm install
Step 4: Configure Environment
Create a .env file in the root directory:

bash
cp .env.example .env
Edit .env with your PostgreSQL configuration:

env
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
Step 5: Run the Server
bash
# Development mode (with auto-restart & auto-sync tables)
npm run dev

# Production mode
npm start
Note: In development mode, Sequelize will automatically create/update tables based on your models.

Server will start on http://localhost:5000

🗄️ Database Schema
Tables Created:
users - User accounts with authentication
portfolios - User portfolio summaries
assets - Individual assets in portfolios
trades - All trade transactions
api_keys - User API keys
All tables include:

UUID primary keys
Automatic timestamps (createdAt, updatedAt)
Foreign key constraints
Indexes for performance
📡 API Endpoints
Authentication (/api/auth)
Method	Endpoint	Description	Auth Required
POST	/register	Register new user	No
POST	/login	Login user	No
GET	/me	Get current user	Yes
POST	/logout	Logout user	Yes
Trades (/api/trades)
Method	Endpoint	Description	Auth Required
POST	/	Create new trade	Yes
GET	/	Get all trades	Yes
GET	/:id	Get trade by ID	Yes
DELETE	/:id	Cancel pending trade	Yes
Portfolio (/api/portfolio)
Method	Endpoint	Description	Auth Required
GET	/	Get portfolio	Yes
GET	/summary	Get portfolio summary	Yes
GET	/history	Get trade history	Yes
GET	/performance	Get performance data	Yes
Market Data (/api/market)
Method	Endpoint	Description	Auth Required
GET	/	Get market data	No
GET	/:symbol	Get symbol price	No
GET	/:symbol/history	Get historical data	No
GET	/search	Search symbols	No
GET	/trending	Get trending symbols	No
GET	/movers/gainers	Get top gainers	No
GET	/movers/losers	Get top losers	No
Settings (/api/settings)
Method	Endpoint	Description	Auth Required
GET	/	Get user settings	Yes
PUT	/	Update settings	Yes
PUT	/profile	Update profile	Yes
PUT	/password	Change password	Yes
GET	/stats	Get account stats	Yes
POST	/api-keys	Create API key	Yes
DELETE	/api-keys/:id	Delete API key	Yes
🔌 WebSocket Events
Connect to WebSocket at http://localhost:5000

Client → Server
javascript
// Subscribe to symbols
socket.emit('subscribe', ['BTC', 'ETH', 'AAPL']);

// Unsubscribe from symbols
socket.emit('unsubscribe', ['AAPL']);
Server → Client
javascript
// Market updates (every 2 seconds)
socket.on('marketUpdate', (data) => {
  console.log(data); // Array of market data objects
});

// Trending updates (every 30 seconds)
socket.on('trendingUpdate', (data) => {
  console.log(data);
});
📝 Example Requests
Register User
bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "password123",
    "name": "John Trader"
  }'
Login
bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@example.com",
    "password": "password123"
  }'
Create Trade
bash
curl -X POST http://localhost:5000/api/trades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "buy",
    "symbol": "BTC",
    "quantity": 0.5,
    "price": 45000
  }'
Get Market Data
bash
curl http://localhost:5000/api/market?symbols=BTC,ETH,AAPL
🧪 Testing with Mock Data
The backend includes mock market data for the following symbols:

Cryptocurrencies:

BTC (Bitcoin)
ETH (Ethereum)
Stocks:

AAPL (Apple)
GOOGL (Google)
TSLA (Tesla)
MSFT (Microsoft)
AMZN (Amazon)
NFLX (Netflix)
META (Meta)
NVDA (NVIDIA)
Prices update dynamically with realistic volatility.

💾 PostgreSQL Advantages
ACID Transactions - Guaranteed data consistency for trades
Referential Integrity - Foreign keys enforce data relationships
Complex Queries - Efficient joins and aggregations
Data Types - Precise DECIMAL types for financial data
Scalability - Better performance for complex financial operations
Backup & Recovery - Enterprise-grade data protection
🔐 Security Features
Password hashing with bcrypt
JWT token authentication
Input validation with express-validator
CORS protection
SQL injection prevention (Sequelize parameterized queries)
Database transaction support for financial operations
🐛 Error Handling
All errors return JSON with consistent format:

json
{
  "error": "Error message",
  "details": [] // Optional validation errors
}
📊 Database Models
User
UUID id, email, password (hashed)
name, balance (DECIMAL)
settings (currency, notifications, theme)
timestamps
Trade
UUID id, userId (FK)
type (ENUM: BUY/SELL)
symbol, quantity (DECIMAL), price (DECIMAL)
totalValue, fee, status
timestamps
Portfolio
UUID id, userId (FK, unique)
totals (invested, value, P&L)
timestamps
Asset
UUID id, portfolioId (FK)
symbol, quantity, prices, P&L
timestamps
ApiKey
UUID id, userId (FK)
name, key (unique)
timestamps
🚀 Deployment
Environment Variables for Production
env
NODE_ENV=production
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=trading_system
DB_USER=your_db_user
DB_PASSWORD=your_strong_password
JWT_SECRET=very_strong_secret_key
FRONTEND_URL=https://your-frontend-domain.com
Deploy to Heroku with PostgreSQL
bash
# Create Heroku app
heroku create your-trading-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Check database
heroku pg:info
Deploy to Railway/Render
Connect your Git repository
Add PostgreSQL database service
Set environment variables
Deploy (auto-detects Node.js)
🔧 Troubleshooting
Database Connection Issues
bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Check connection
psql -U postgres -d trading_system -c "SELECT version();"
Reset Database
bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE trading_system;"
psql -U postgres -c "CREATE DATABASE trading_system;"

# Restart server (tables will auto-create in dev mode)
npm run dev
📚 Additional Resources
Express.js Documentation
Sequelize Documentation
PostgreSQL Documentation
Socket.io Documentation
JWT.io
🤝 Contributing
Feel free to submit issues and enhancement requests!

📄 License
ISC

Note: This backend uses mock market data. For production, integrate real market data APIs like:

Alpha Vantage (stocks)
CoinGecko/CoinMarketCap (crypto)
IEX Cloud (stocks)
Polygon.io (stocks & crypto)
