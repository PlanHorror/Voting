#  Secure Digital Voting System

A comprehensive digital voting platform that implements cryptographic security measures to ensure vote integrity, anonymity, and transparency in electronic elections.

## 🚀 Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT with Passport.js
- **Cryptography**: RSA blind signatures for vote anonymity
- **Validation**: Class-validator and Class-transformer
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: ECharts for React
- **HTTP Client**: Axios
- **UI Components**: Custom components with Sonner for notifications

### Architecture

- **Monolithic Backend**: Single NestJS application handling all services
- **Database**: PostgreSQL with Prisma ORM for data management
- **API Design**: RESTful APIs with comprehensive documentation

## 📋 Project Overview

This secure voting system implements a multi-layered architecture designed to prevent electoral fraud and ensure voter privacy. The system uses:

- **Role-based Access Control**: Three distinct user roles (Voters, Supervisors, Signers)
- **Cryptographic Security**: RSA blind signatures to ensure vote anonymity
- **End-to-End Encryption**: Votes are encrypted and cannot be traced back to voters
- **Audit Trail**: Complete logging and monitoring of all voting activities
- **Real-time Results**: Live vote counting and result visualization

### Key Features

- **Anonymous Voting**: Uses blind signature cryptography
- **Multi-Role System**: Supervisors create elections, Signers manage security
- **Real-time Dashboard**: Live monitoring and statistics
- **Secure Authentication**: JWT-based authentication with role management
- **Vote Integrity**: Cryptographic verification of all votes
- **Responsive Design**: Modern, mobile-friendly interface

## 🔧 Dependencies & Requirements

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **PostgreSQL**: Version 13 or higher
- **Yarn**: Latest stable version (preferred package manager)

### Backend Dependencies

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/swagger": "^11.1.5",
  "@prisma/client": "^6.8.2",
  "bcrypt": "^5.1.1",
  "node-forge": "^1.3.1",
  "passport-jwt": "^4.0.1",
  "pg": "^8.13.3"
}
```

### Frontend Dependencies

```json
{
  "next": "15.3.1",
  "react": "^19.0.0",
  "axios": "^1.9.0",
  "tailwindcss": "^4",
  "framer-motion": "^12.15.0",
  "echarts-for-react": "^3.0.2",
  "jwt-decode": "^4.0.0"
}
```

## 🚀 Implementation Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd What-is-malware
```

### 2. Environment Setup

#### Backend Setup

```bash
cd Backend
yarn install

# Create environment file
copy .env.example .env
# Configure your PostgreSQL database URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/voting_db"
JWT_SECRET="your-jwt-secret-key"
```

#### Frontend Setup

```bash
cd Frontend
yarn install

# Create environment file
copy .env.example .env.local
# Configure your backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. Database Setup

#### Backend Database

```bash
cd Backend
npx prisma generate
npx prisma db push
# Optional: Seed the database
npx prisma db seed
```

### 4. Running the Application

```bash
# Terminal 1 - Backend
cd Backend
yarn start:dev

# Terminal 2 - Frontend
cd Frontend
yarn dev
```

### 5. Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
- **Database Admin**: Use your preferred PostgreSQL client

### 6. Default User Accounts

#### Create Supervisor Account

```bash
# Use the application's registration endpoint or seed script
POST /auth/supervisor/register
{
  "username": "admin",
  "password": "securePassword123"
}
```

#### Create Signer Account

```bash
POST /auth/signer/register
{
  "username": "signer1",
  "email": "signer@example.com",
  "phone": "+1234567890",
  "password": "securePassword123"
}
```

### 7. Creating Your First Election

1. **Login as Supervisor**: Access the supervisor dashboard
2. **Create Signer**: Register election signers
3. **Create Vote Session**: Set up election parameters
4. **Add Candidates**: Define election choices
5. **Generate Voting Keys**: Distribute to eligible voters
6. **Monitor Election**: Track real-time results

### 8. Development Scripts

#### Backend

```bash
yarn start:dev       # Development mode with hot reload
yarn build           # Production build
yarn test            # Run unit tests
yarn test:e2e        # Run end-to-end tests
yarn lint            # Code linting
```

#### Frontend

```bash
yarn dev             # Development mode
yarn build           # Production build
yarn start           # Production server
yarn lint            # Code linting
```

### 9. Production Deployment

#### AWS EC2 Deployment with PM2

##### Prerequisites

- AWS account with EC2 access
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

##### Step 1: Launch EC2 Instance

1. **Create EC2 Instance**:

   - Choose Ubuntu 22.04 LTS AMI
   - Instance type: t3.medium or higher (minimum 4GB RAM)
   - Configure security groups:
     - SSH (22) - Your IP only
     - HTTP (80) - Anywhere
     - HTTPS (443) - Anywhere
     - Custom TCP (3000) - Anywhere (Frontend)
     - Custom TCP (3001) - Anywhere (Backend API)

2. **Connect to your instance**:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

##### Step 2: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Install PM2 globally
yarn global add pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

##### Step 3: PostgreSQL Configuration

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE voting_db;
CREATE USER voting_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE voting_db TO voting_user;
\q
```

##### Step 4: Deploy Application

```bash
# Clone your repository
git clone https://github.com/your-username/What-is-malware.git
cd What-is-malware

# Setup Backend
cd Backend
yarn install

# Create production environment file
nano .env
```

**Backend .env file**:

```env
DATABASE_URL="postgresql://voting_user:your_secure_password@localhost:5432/voting_db"
JWT_SECRET="your-super-secure-jwt-secret-key"
NODE_ENV="production"
PORT=3001
```

```bash
# Run database migrations
npx prisma generate
npx prisma db push

# Build backend
yarn build

# Setup Frontend
cd ../Frontend
yarn install

# Create production environment file
nano .env.local
```

**Frontend .env.local file**:

```env
NEXT_PUBLIC_API_URL="http://your-domain-or-ip:3001"
NODE_ENV="production"
```

```bash
# Build frontend
yarn build
```

##### Step 5: PM2 Configuration

Create PM2 ecosystem file:

```bash
# In project root directory
nano ecosystem.config.js
```

**ecosystem.config.js**:

```javascript
module.exports = {
  apps: [
    {
      name: "voting-backend",
      cwd: "./Backend",
      script: "dist/main.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
    {
      name: "voting-frontend",
      cwd: "./Frontend",
      script: "yarn",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

```bash
# Start applications with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

##### Step 6: Nginx Configuration

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/voting-system
```

**Nginx configuration**:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/voting-system /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

##### Step 7: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

##### Step 8: Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000
sudo ufw allow 3001

# Check firewall status
sudo ufw status
```

##### Step 9: Monitoring and Maintenance

```bash
# Monitor PM2 processes
pm2 status
pm2 logs
pm2 monit

# Restart applications
pm2 restart all

# Update application
git pull origin main
cd Backend && yarn install && yarn build
cd ../Frontend && yarn install && yarn build
pm2 restart all
```

##### Useful PM2 Commands

```bash
pm2 start ecosystem.config.js    # Start all applications
pm2 stop all                     # Stop all applications
pm2 restart all                  # Restart all applications
pm2 reload all                   # Reload all applications (zero downtime)
pm2 delete all                   # Delete all applications
pm2 logs                         # View logs
pm2 monit                        # Monitor resources
pm2 save                         # Save current PM2 configuration
pm2 resurrect                    # Restore saved PM2 configuration
```

#### Local Docker Deployment (Alternative)

```bash
# Build and deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

#### Manual Deployment Steps

1. Build both frontend and backend
2. Configure production environment variables
3. Set up PostgreSQL production database
4. Deploy to your hosting platform
5. Configure SSL/TLS certificates
6. Set up monitoring and logging

## 🔐 Security Features

- **Cryptographic Voting**: RSA blind signatures ensure vote anonymity
- **Role-Based Access**: Strict permission controls
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Configuration**: Properly configured cross-origin requests
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Complete activity tracking

## 📊 Monitoring & Analytics

The system provides comprehensive dashboards for:

- Real-time vote counting
- Participation statistics
- System health monitoring
- Security audit logs
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`
