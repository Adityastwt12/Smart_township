
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
console.log('Starting HAL Township Backend Server...');


// ==========================================
// 1. Configuration and Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const PORT = process.env.PORT || 5000;
const {connectDB} = require('./config/db');
connectDB();

// ==========================================
// 2. Mock Database (Temporary Solution)
// ==========================================
const mockDB = {
 users: [
    {
      id: uuidv4(),
      residentId: 'R1001',
      password: bcrypt.hashSync('resident123', 8),
      role: 'resident',
      name: 'John Resident',
      email: 'john@example.com'
    },
    {
      id: uuidv4(),
      username: 'admin',
      password: bcrypt.hashSync('admin123', 8),
      role: 'admin',
      name: 'System Admin',
      email: 'admin@example.com'
    }
  ],
  MONGO_URI: process.env.MONGODB_URI || undefined,

  // Mock database methods (will be replaced with real DB calls)
  findUserByResidentId: (residentId) => {
    return mockDB.users.find(user => user.residentId === residentId);
  },

  findAdminByUsername: (username) => {
    return mockDB.users.find(user => user.username === username && user.role === 'admin');
  },

  addUser: (user) => {
    const newUser = { id: uuidv4(), ...user };
    mockDB.users.push(newUser);
    return newUser;
  }
};

// ==========================================
// 3. Authentication Middleware
// ==========================================
function authenticateJWT(req, res, next) {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} is not authorized to access this resource`
      });
    }
    next();
  };
}

// ==========================================
// 4. Authentication Routes
// ==========================================

// Resident Login
app.post('/api/auth/resident-login', async (req, res) => {
  try {
    const { residentId, password } = req.body;

    // Validation
    if (!residentId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide resident ID and password' 
      });
    }

    // Find user
    const user = mockDB.findUserByResidentId(residentId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT
    const token = jwt.sign(
      { 
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email
        }
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
});

// Admin Login
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { username, password, otp } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username and password' 
      });
    }

    // Find admin user
    const user = mockDB.findAdminByUsername(username);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Mock OTP verification (replace with real implementation)
    if (otp !== '123456') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OTP code' 
      });
    }

    // Create JWT
    const token = jwt.sign(
      { 
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email
        }
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      success: true, 
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
});

// Token Verification
app.get('/api/auth/verify', authenticateJWT, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});

// ==========================================
// 5. Protected Routes
// ==========================================

// Example protected admin route
app.get('/api/admin/dashboard', authenticateJWT, authorizeRoles('admin'), (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to the admin dashboard',
    data: {
      stats: {
        users: 42,
        issues: 15,
        resolved: 38
      }
    }
  });
});

// Example protected resident route
app.get('/api/resident/profile', authenticateJWT, authorizeRoles('resident'), (req, res) => {
  res.json({ 
    success: true,
    message: 'Resident profile data',
    user: req.user
  });
});

// ==========================================
// 6. Server Startup
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Mock users in database:');
  connectDB();
  console.log(mockDB.users.map(u => ({ 
    id: u.id, 
    role: u.role, 
    name: u.name,
    credentials: {
      residentId: u.residentId || 'N/A',
      username: u.username || 'N/A',
      password: '********' // Never log real passwords
    }
  })));
});