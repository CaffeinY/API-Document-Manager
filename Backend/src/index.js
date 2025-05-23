const express = require('express');
const app = express();
const cors = require('cors');
const docsRoutes = require('./routes/docsRoutes');
const authRoutes = require('./routes/authRoutes'); 
const session = require('express-session');
const passport = require('./config/passport');
// const RedisStore = require('connect-redis').default;
const {RedisStore} = require("connect-redis")

// const RedisStore = connectRedis(session); 

const {redisClient, connectRedisClient } = require('./config/redisClient'); 





require('dotenv').config();

// Set up CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://api-document-manager.onrender.com'
];

// keys to fix the cors cookie issue
app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  // To allow cookies or other credentials, set credentials to true
  credentials: true,
  // You can also configure the allowed methods and headers as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to Redis
connectRedisClient();

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "USER-COOKIE-SESSION:",
  ttl: 7 * 24 * 60 * 60 // 1 day in seconds
})



app.use(session({
  store: redisStore,
  secret: process.env.AUTH_SESSION_SECRET,    
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure:  process.env.NODE_ENV === 'production' ? "true" : "auto", // Set to true if using https in production
    sameSite: process.env.NODE_ENV === 'production' ?  'none' : 'lax',   
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/docs', docsRoutes);
app.use('/api/auth', authRoutes); 

const port = process.env.PORT || 3001; // Default to 3000 if PORT is not set


(async () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();

