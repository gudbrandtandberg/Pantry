# Family Pantry App

A collaborative pantry management app for families.

## Features

- Multi-user pantry management
- Real-time synchronization
- Shared shopping lists
- Invite system for pantry sharing
- Multi-language support (English, Norwegian, Russian)
- Authentication with email/password and Google
- Responsive design

## Tech Stack

- Frontend: React 18 + TypeScript + Tailwind CSS
- Build Tool: Vite
- Backend: Firebase (Firestore + Auth)
- Language Support: Norwegian, English, Russian

## Current Version

v0.1.0

## Roadmap

### Completed ✅

- [x] Basic pantry management
- [x] User authentication (Email + Google)
- [x] Real-time updates
- [x] Sharing functionality
- [x] Multi-language support
- [x] Member management

### Up Next 🚀

- [ ] User Management
  - Profile settings
  - Language preferences
  - Account deletion

### Future Enhancements 🌟

- [ ] Offline Support
  - Cache data for offline use
  - Queue updates
- [ ] Mobile Experience
  - PWA support
  - Touch optimizations
- [ ] Data Management
  - Export/Import functionality
  - Backup options
- [ ] Notifications
  - Item updates
  - Member activity
  - Low stock warnings

## Security

- Firebase Authentication
- Firestore Security Rules
- Role-based access control

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gudbrandtandberg/Pantry

# Navigate to the app directory
cd pantry-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Firebase configuration to .env

# Start the development server
npm run dev
```

## Cost Considerations

Using Firebase's free tier for initial deployment:

- Authentication: 10K/month
- Hosting: 10GB/month
- Firestore: 1GB storage, 10GB/month transfer
- Cloud Functions: 125K invocations/month

These limits are more than sufficient for a family-scale application.

## License

All rights reserved © Duff Development
