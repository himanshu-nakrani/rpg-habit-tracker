# RPG Habit Tracker

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</p>

Turn your daily habits into an epic RPG adventure! Level up your character, earn XP, maintain streaks, and unlock achievements by completing real-world quests (habits).

![Dashboard Preview](docs/screenshots/dashboard.png)

## Demo Video

Watch the demo on YouTube:

[![RPG Habit Tracker Demo](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

Or view locally: `docs/demo.mp4`

## Features

### Quest System
- Create habits as "quests" with different difficulty levels (Easy, Medium, Hard)
- Each difficulty awards different base XP: Easy (10 XP), Medium (25 XP), Hard (50 XP)
- Categorize quests by skill type: Health, Mind, Career, Social, Creativity
- Edit, delete, and track progress on all your quests

### RPG Progression
- **Leveling System**: Earn XP to level up your character (100 × level^1.5 XP per level)
- **Class System**: Choose your avatar class (Warrior, Mage, Rogue, Healer, Ranger)
- **Streak Counter**: Maintain daily streaks for bonus XP multipliers (up to +60% at 30 days)
- **Streak Milestones**: Bonus XP at 3, 7, 14, 30, 60, and 100 day streaks

### Bonus Systems
- **Combo System**: Complete multiple quests in a day for +15% XP multiplier per combo
- **Critical Hit**: 12% chance to get 2x XP on any quest completion
- **Perfect Day**: Complete all active quests for a bonus (50 + level × 10 XP)

### Achievements
- Unlock achievements as you progress
- Track your gaming history and milestones

### Additional Features
- **Quest Insights**: View detailed statistics for each habit (completion rate, streaks, power score)
- **History Page**: Track your progress over time with XP charts
- **Profile Page**: Customize your username and avatar
- **Toast Notifications**: Real-time feedback on quest completions with battle cries
- **Confetti Celebrations**: Visual celebrations for level ups and perfect days

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** / **PostgreSQL** - Database (SQLite for dev, Postgres for prod)
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **JWT Authentication** - Secure user authentication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/himanshu-nakrani/rpg-habit-tracker.git
   cd rpg-habit-tracker
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (Terminal 1)
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### First Run
- Register a new account through the login page
- Start creating your first quests!

## Deployment

### Backend → Heroku

1. **Install Heroku CLI** and log in
   ```bash
   brew install heroku
   heroku login
   ```

2. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY="your-strong-secret-key"
   heroku config:set FRONTEND_URL="https://your-app.vercel.app"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Verify** — visit `https://your-app-name.herokuapp.com`

> **Note:** `DATABASE_URL` is set automatically by the Heroku Postgres add-on. The database schema is auto-created on first startup.

---

### Frontend → Vercel

1. **Install Vercel CLI** and log in
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy from the frontend directory**
   ```bash
   cd frontend
   vercel
   ```
   - Set **Root Directory**: `frontend`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `dist`

3. **Set environment variable** in Vercel dashboard or CLI
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-app-name.herokuapp.com
   ```

4. **Redeploy** to apply env vars
   ```bash
   vercel --prod
   ```

5. **Update Heroku CORS** with your Vercel URL
   ```bash
   heroku config:set FRONTEND_URL="https://your-app.vercel.app"
   ```

## Project Structure

```
rpg-habit-tracker/
|-- backend/
|   |-- main.py           # FastAPI app entry point
|   |-- database.py       # Database configuration
|   |-- models.py         # SQLAlchemy models
|   |-- schemas.py        # Pydantic schemas
|   |-- auth.py           # Authentication routes
|   |-- habits.py         # Habit/quest routes
|   |-- progress.py       # Progress tracking routes
|   |-- achievements.py   # Achievement routes
|   |-- xp.py             # XP calculation logic
|   |-- requirements.txt  # Python dependencies
|
|-- frontend/
|   |-- src/
|   |   |-- components/   # React components
|   |   |-- pages/        # Page components
|   |   |-- stores/       # Zustand stores
|   |   |-- api/          # API client
|   |   |-- App.jsx       # Main app component
|   |   |-- index.css     # Global styles
|   |   |-- rpg-theme.css # RPG theme styles
|   |-- index.html        # HTML entry point
|   |-- vercel.json       # Vercel deployment config
|   |-- package.json      # Node dependencies
|
|-- Procfile              # Heroku process definition
|-- runtime.txt           # Python version for Heroku
|-- requirements.txt      # Root requirements (Heroku)
|-- docs/
|   |-- screenshots/      # App screenshots
|   |-- demo.mp4          # Demo video
|
|-- README.md             # This file
```

## Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Create Quest Modal
![Create Quest](docs/screenshots/create-quest.png)

### Quest Insights
![Quest Insights](docs/screenshots/quest-insights.png)

### Achievements Panel
![Achievements](docs/screenshots/achievements.png)

### Profile Page
![Profile](docs/screenshots/profile.png)

### History Page
![History](docs/screenshots/history.png)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/me` - Update user profile

### Habits
- `GET /habits/` - Get all active habits
- `POST /habits/` - Create new habit
- `PUT /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Deactivate habit
- `POST /habits/{id}/complete` - Complete habit
- `DELETE /habits/{id}/complete` - Undo completion
- `GET /habits/{id}/insights` - Get habit statistics

### Progress
- `GET /progress/daily` - Get daily progress
- `GET /progress/achievements` - Get all achievements
- `GET /progress/history` - Get completion history
- `GET /progress/streak-info` - Get streak info
- `GET /progress/dashboard` - Get full dashboard data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

<p align="center">Made with by Himanshu Nakrani</p>
