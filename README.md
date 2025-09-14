# 🏪 Local Marketplace

A modern, full-stack marketplace application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Buy and sell items locally with a seamless user experience.

## ✨ Features

### 🔐 **Authentication & User Management**
- User registration and login with NextAuth.js
- Secure session management
- User profiles with ratings and reviews

### 📦 **Listings Management**
- Create, edit, and manage item listings
- Image upload with Cloudinary integration
- Advanced search and filtering
- Category-based organization
- Location-based discovery

### 💬 **Real-time Messaging**
- In-app messaging system between buyers and sellers
- Thread-based conversations
- Message read receipts
- Real-time notifications

### 🔔 **Notification System**
- Real-time notifications for messages, offers, and updates
- Notification preferences management
- Push notification support (PWA)

### 💰 **Offers & Transactions**
- Make and receive offers on listings
- Offer management (accept/reject/counter)
- Transaction history

### ⭐ **Ratings & Reviews**
- User rating system
- Review management
- Trust and reputation building

### 👑 **Admin Dashboard**
- User management
- Listing moderation
- Report handling
- Analytics and statistics

### 📱 **Progressive Web App (PWA)**
- Offline functionality
- App-like experience
- Push notifications
- Responsive design

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Zustand** - Client state management

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution

### **Infrastructure**
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Cloudinary** - Image management
- **Vercel** - Deployment platform (recommended)

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/local-marketplace.git
   cd local-marketplace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/marketplace"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Project Structure

```
local-marketplace/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   ├── listings/      # Listing-related components
│   │   ├── messaging/     # Messaging components
│   │   └── admin/         # Admin components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── docker-compose.yml     # Docker configuration
└── package.json          # Dependencies and scripts
```

## 🌟 Key Features Implementation

### Authentication Flow
- JWT-based authentication with NextAuth.js
- Session management and route protection
- Role-based access control (User/Admin)

### Real-time Features
- WebSocket integration for live messaging
- Server-Sent Events for notifications
- Optimistic UI updates

### Performance Optimizations
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Database query optimization with Prisma
- Caching strategies with React Query

### Security Features
- CSRF protection
- SQL injection prevention with Prisma
- Input validation and sanitization
- Rate limiting on API routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first approach
- All contributors and the open-source community

## 📞 Support

If you have any questions or need help, please open an issue or reach out to the maintainers.

---

**Built with ❤️ by [Your Name]**