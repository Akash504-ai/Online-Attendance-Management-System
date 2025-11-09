# 🏫 Trackify – Online Attendance Management System

A modern web-based platform to digitally manage attendance for institutions and organizations.

## 🚀 Features

### Student/Employee Features
- 📊 Real-time attendance dashboard with statistics
- 📅 View daily/monthly attendance records
- 📈 Analytics and trends visualization
- 📄 Export attendance reports (PDF/Excel)
- 👤 Profile management with photo upload

### Admin/Teacher Features
- 🎯 Mark and manage attendance records
- 👥 User management (Add/Edit/Remove students)
- 📊 Generate comprehensive reports
- 📧 Email notifications and alerts
- ⚙️ System settings and configuration
- 📤 Bulk import/export via CSV/Excel

## 🛠️ Tech Stack

### Backend
- PHP 8.x
- MySQL Database
- RESTful API Architecture
- JWT Authentication

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- shadcn/ui components
- Recharts for analytics
- Lucide React for icons

## 📁 Project Structure

```
Trackify/
├── backend/              # PHP API
│   ├── api/             # API endpoints
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── middleware/      # Auth & validation
│   └── utils/           # Helper functions
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── styles/      # Global styles
│   └── public/          # Static assets
└── database/            # SQL schemas
```

## 🚀 Getting Started

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Node.js 18+ and npm
- Modern web browser

### Backend Setup

1. Start XAMPP (Apache and MySQL)

2. Create database:
```sql
CREATE DATABASE trackify;
```

3. Import database schema:
```bash
# Import from database/schema.sql via phpMyAdmin or command line
mysql -u root -p trackify < database/schema.sql
```

4. Configure backend:
```bash
# Update backend/config/database.php with your MySQL credentials
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🔐 Default Credentials

### Admin Account
- Email: admin@trackify.com
- Password: admin123

### Teacher Account
- Email: teacher@trackify.com
- Password: teacher123

### Student Account
- Email: student@trackify.com
- Password: student123

**⚠️ Change these credentials after first login!**

## 📱 Features Overview

### Authentication
- Secure login/signup with JWT
- Password reset via email
- Role-based access control (Admin, Teacher, Student)

### Dashboard
- Attendance overview cards
- Quick action buttons
- Notifications panel
- Real-time statistics

### Attendance Management
- Mark daily attendance
- View attendance history
- Filter by date/subject/department
- Bulk operations support

### Reports & Analytics
- Visual charts and graphs
- Monthly/custom date range reports
- Export to PDF/Excel
- Attendance trends analysis

### User Management (Admin)
- Add/edit/remove users
- Assign roles and permissions
- Import users via CSV
- View individual attendance history

## 🎨 UI Features

- ✅ Fully responsive (Mobile, Tablet, Desktop)
- 🌓 Dark/Light mode support
- 🎭 Smooth animations and transitions
- 📊 Interactive charts
- 🎯 Material-inspired design

## 🔒 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CSRF tokens
- Role-based access control

## 📧 Email Notifications

- Low attendance alerts
- Daily/weekly attendance summaries
- Password reset emails
- System announcements

## 🤝 Contributing

This is a complete attendance management solution. Feel free to customize it for your institution's needs.

## 📄 License

MIT License - Feel free to use for educational or commercial purposes.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for modern educational institutions**
