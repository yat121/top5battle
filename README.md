# ⚔️ Top5Battle

> The ultimate 1v1 battle and niche top-5 content platform. Vote. Comment. Decide.

![Top5Battle](https://img.shields.io/badge/Status-Live-brightgreen) ![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue) ![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)

## 🚀 Live Site

**https://yat121.github.io/top5battle/**

## Features

### Pages
- **Homepage** — Hero section, featured active battles, recent top-5 lists
- **Battle Arena** (`/battle/[id]`) — 1v1 voting with 4 images per side, countdown timer, comments
- **Top 5 Lists** (`/top5/[id]`) — Ranked items with expandable details
- **Results** (`/results/[id]`) — Winner showcase with vote breakdown
- **Leaderboard** — Top battles by views and votes
- **Profile** — User activity, votes, and comments

### Authentication
- 🔵 Google Sign-In
- 🐙 GitHub Sign-In
- 📧 Email/Password fallback
- Auto-account creation on first social login

### Design
- 🌙 Dark theme with accent orange (#ff6b35)
- 📱 Mobile-first, responsive design
- ✨ Confetti animation on votes
- 🎨 Bebas Neue + Inter typography

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML/CSS/JS (SPA) |
| Authentication | Firebase Auth |
| Database | Firebase Realtime Database |
| Analytics | Google Analytics 4 |
| Ads Tracking | Meta Pixel |
| Hosting | GitHub Pages |

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable: Google, GitHub, Email/Password

3. Enable Realtime Database:
   - Create database in test mode initially
   - Update rules for production

4. Get your config:
   - Project Settings → General → Your apps → Web app
   - Copy the `firebaseConfig` object

5. Update `app.js` with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXXXX",
  appId: "YOUR_APP_ID"
};
```

### Firebase Security Rules

```json
{
  "rules": {
    "battles": {
      "$battleId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "top5": {
      "$id": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    },
    "comments": {
      "$battleId": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

## Data Model

```
/battles/{battleId}/
  topic: string
  sideA: { name, description, imageUrls: [4], voteCount }
  sideB: { name, description, imageUrls: [4], voteCount }
  createdAt: timestamp
  endsAt: timestamp
  status: "active" | "closed"
  views: number

/top5/{id}/
  topic: string
  hook: string
  items: [{rank, name, description, imageUrl}]
  createdAt: timestamp

/users/{userId}/
  name: string
  email: string
  avatar: string
  votes: { [battleId]: "A" | "B" }
  comments: []

/comments/{battleId}/
  -Kxyz: { authorId, authorName, text, createdAt }
```

## Analytics Events

| Event | Trigger |
|-------|---------|
| `page_view` | Every page load |
| `vote` | User casts a vote |
| `comment` | User posts a comment |
| `share` | User shares a battle |
| `login` | User completes login |

## Local Development

```bash
# Clone or navigate to project
cd projects/top5battle

# Serve locally (any static server works)
npx serve .

# Or use Python
python -m http.server 8000
```

## Deployment to GitHub Pages

The site is automatically deployed to GitHub Pages from the `main` branch.

1. Push to main branch
2. GitHub Actions builds and deploys
3. Site available at `https://yat121.github.io/top5battle/`

## Project Structure

```
top5battle/
├── index.html      # Main SPA entry
├── styles.css      # All styles
├── app.js          # Application logic, routing, Firebase
├── README.md       # This file
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT © 2026 Top5Battle

---

*Built with ⚔️ for the community*
