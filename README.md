# Pantry Manager

A family-oriented pantry and shopping list manager, with support for multiple locations (home, cabin, etc.) and real-time updates across devices.

## Features

### Current Features

- 🏠 Multiple pantry locations (home, cabin, etc.)
- 📝 Shopping list management
- 🔄 Move items between "In Stock" and "Shopping List"
- 🌐 Internationalization (Norwegian/English)
- 📱 Responsive design with Tailwind CSS

### Planned Features

See the roadmap below for detailed plans.

## Tech Stack

- Frontend: React 18 + TypeScript + Tailwind CSS
- Build Tool: Vite
- Current Storage: Local Storage (to be replaced with Firebase)
- Language Support: Norwegian (Default) and English

## Development Roadmap

### Current State (Phase 0) ✅

- Basic React + TypeScript + Tailwind setup
- Local storage implementation
- Basic pantry management (create, select)
- Product management (add, move, delete)
- Internationalization (Norwegian/English)
- Basic UI components and styling

### Phase 1: Authentication & User Management

1. **Basic Auth Setup**
   - Firebase Auth integration
   - Email/password authentication
   - Invitation-only signup system

2. **User Management**
   - User profiles
   - Invitation system
   - Email verification
   - Password reset flow

3. **Permission System**
   - Pantry ownership model
   - Sharing/collaboration model
   - Role-based access (owner, editor, viewer)
   - Invitation acceptance flow

### Phase 2: Backend & Real-time Updates

1. **Backend Storage**
   - Firebase Realtime Database/Firestore setup
   - Data model optimization
   - Migration from localStorage
   - Offline support

2. **Real-time Updates**
   - Firebase real-time listeners
   - Optimistic UI updates
   - Conflict resolution
   - Sync status indicators

### Phase 3: Core Feature Enhancement

1. **Product Management**
   - Categories (e.g., Taco Friday 🌮, Matpakke 🥪)
   - Expiry date tracking
   - Shopping list optimization
   - Quantity tracking improvements

2. **Smart Features**
   - Common items quick-add
   - Shopping list suggestions
   - Usage patterns/statistics
   - Seasonal items (cabin supplies)

### Phase 4: UI/UX Refinement

1. **Mobile Optimization**
   - Responsive design improvements
   - Touch interactions
   - Offline experience
   - PWA setup

2. **User Experience**
   - Loading states
   - Error handling
   - Success feedback
   - Tour/onboarding

### Phase 5: Deployment & Maintenance

- Initial deployment setup
- Monitoring and analytics
- Backup strategy
- Security audits

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

### Environment Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Copy your Firebase configuration from Project Settings
3. Create a `.env` file based on `.env.example`
4. Add your Firebase configuration values to `.env`

### Development

The app will be available at `http://localhost:5173`

## Contributing

This is currently a private family project, but we may open it for contributions in the future.

## License

Private - All Rights Reserved

## Cost Considerations

Using Firebase's free tier for initial deployment:

- Authentication: 10K/month
- Hosting: 10GB/month
- Realtime Database: 1GB storage, 10GB/month transfer
- Cloud Functions: 125K invocations/month

These limits are more than sufficient for a family-scale application.
