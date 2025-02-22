# AIJobsNow by Fourslash

AIJobsNow is your premier destination for discovering cutting-edge career opportunities in artificial intelligence, machine learning, and data science. We aggregate and curate job listings from industry leaders like OpenAI and Character, providing a streamlined platform for AI professionals to find their next role.

## Features

- **Real-time Job Listings**: Access the latest AI job opportunities as they become available
- **Smart Filtering**: Filter jobs by location, company, and remote work options
- **Comprehensive Search**: Search across job titles, descriptions, and departments
- **Location Support**: Find opportunities in major tech hubs including Tokyo and Singapore
- **Salary Information**: View compensation details when available
- **Modern UI**: Clean, responsive interface with dark/light theme support
- **Accessibility**: Built with web accessibility standards in mind

## Technology Stack

### Frontend
- React.js for the UI framework
- Material UI for component design
- Styled Components for custom styling
- Context API for state management

### API Integration
- Ashby API for job data
- Axios for API requests
- Custom middleware for data transformation

### Performance
- Optimized search and filtering algorithms
- Responsive design for all devices
- Fast page load times

### Development Tools
- Create React App
- ESLint for code quality
- Prettier for code formatting

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

## About Fourslash

Fourslash is committed to connecting talented professionals with opportunities in artificial intelligence. Visit [Fourslash](https://www.fourslash.com) to learn more about our mission to advance the AI industry through strategic talent placement.
