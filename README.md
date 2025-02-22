# AI Jobs Portal

A modern job board application focused on AI and technology positions, built with React and Material-UI. The application aggregates job listings from leading AI companies through the Ashby API.

🔗 [Live Demo](https://ai-jobs-tau.vercel.app/)

## Features

### 🔍 Advanced Job Search
- Real-time search functionality with instant results
- Clear search option to reset results
- Job count display showing available positions
- Modern and responsive search interface

### 📊 Smart Filtering System
- Filter by multiple criteria:
  - Job Type (Full-time, Part-time, Contract)
  - Location
  - Experience Level
  - Department
  - Remote Options
- Toggle filters on/off easily
- Maintains filter state across searches

### 💼 Job Listings
- Clean, card-based job presentation
- Essential job details at a glance:
  - Job Title
  - Company
  - Location
  - Salary Range (when available)
  - Employment Type
  - Department
- Responsive grid layout

### 🔄 Sorting Options
- Multiple sorting criteria:
  - Alphabetical (A-Z)
  - Salary (High to Low)
  - Salary (Low to High)
- Sort toggle with easy access

### 🎨 UI/UX Features
- Material-UI components for consistent design
- Responsive layout for all screen sizes
- Loading states and error handling
- Clean and intuitive interface
- Dark/Light theme support

## Technical Stack

### Frontend
- React 18
- Material-UI v5
- Axios for API calls
- Modern ES6+ JavaScript

### API Integration
- Ashby API for job listings
- Real-time data fetching
- Error handling and retry logic

### Deployment
- Vercel for hosting
- Environment configuration for development and production
- Optimized build process

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/FourslashHQ/AIJobs.git
cd ai-jobs-portal
```

2. Install dependencies
```bash
npm install
```

3. Create environment files
```bash
# .env
REACT_APP_ASHBY_API_BASE_URL=https://api.ashbyhq.com/posting-api/job-board
```

4. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
ai-jobs-portal/
├── src/
│   ├── components/         # React components
│   │   ├── FilterSidebar.js
│   │   ├── JobCard.js
│   │   ├── JobList.js
│   │   └── SearchBar.js
│   ├── services/          # API and other services
│   │   └── api.js
│   ├── theme/            # Theme configuration
│   │   └── ThemeContext.js
│   └── App.js            # Main application component
├── public/               # Static files
└── package.json         # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI Components from [Material-UI](https://mui.com/)
- Job data provided by [Ashby](https://www.ashbyhq.com/)

---

Made with ❤️ by [Fourslash](https://github.com/FourslashHQ)
