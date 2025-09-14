# Deployment and Build Configuration

This document outlines the deployment and build setup for the Local Marketplace application.

## 🚀 Production Build

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Build Commands
```bash
# Install dependencies
npm ci

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate:prod

# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env.production` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-jwt-secret"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Site Configuration
SITE_URL="https://your-domain.com"
NODE_ENV="production"
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t marketplace-app .
```

### Run with Docker Compose
```bash
# Start all services (app, database, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Setup for Docker
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your values
```

## 🌐 Platform Deployments

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### Railway Deployment
1. Connect repository to Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically on push

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Add PostgreSQL database
4. Set environment variables

## 📊 Performance Monitoring

### Bundle Analysis
```bash
npm run analyze
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Code Formatting
```bash
npm run format
npm run format:check
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🎯 PWA Features

The application includes:
- ✅ Service Worker for offline functionality
- ✅ Web App Manifest for installation
- ✅ Optimized caching strategies
- ✅ Push notifications ready
- ✅ App shortcuts and share targets

### Testing PWA
1. Build production version: `npm run build && npm start`
2. Open Chrome DevTools → Application → Service Workers
3. Test offline functionality
4. Test "Add to Home Screen" feature

## 📈 SEO & Performance

### Included Optimizations
- ✅ Automatic sitemap generation
- ✅ Robots.txt configuration
- ✅ Meta tags and Open Graph
- ✅ Image optimization with Next.js
- ✅ Bundle splitting and code optimization
- ✅ PWA caching strategies

### Performance Checklist
- [ ] Configure CDN for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)

## 🔧 Database Management

### Production Migrations
```bash
# Deploy migrations
npm run db:migrate:prod

# Generate Prisma client
npm run db:generate

# Seed database (optional)
npm run db:seed
```

### Backup Strategy
- Regular automated backups
- Point-in-time recovery
- Environment-specific restore procedures

## 📱 Mobile App Ready

The PWA can be:
- Installed on iOS/Android devices
- Used offline with cached content
- Launched from home screen
- Receives push notifications (when implemented)

This completes the production-ready setup for the Local Marketplace application!