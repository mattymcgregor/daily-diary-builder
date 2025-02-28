# Inspector Daily Diary Builder

## Project Description
This is a web application for inspectors to create and submit daily diary entries for construction sites. It captures detailed information about construction activities, weather conditions, and other relevant data for project management.

## GitHub Pages Deployment
This project is deployed to GitHub Pages at:
https://mattymcgregor.github.io/daily-diary-builder/

## SharePoint Integration
The application is designed to be embedded in a SharePoint page and integrate with SharePoint lists for data storage.

### How to Embed in SharePoint
1. In your SharePoint page, add an "Embed" web part
2. Use the following iframe code:
```html
<iframe 
  src="https://mattymcgregor.github.io/daily-diary-builder/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  allowfullscreen
></iframe>
```
3. Enable "Resize to fit the page" option

## Local Development

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup and Run
```sh
# Clone the repository
git clone https://github.com/MattMcGregor/daily-diary-builder.git

# Navigate to the project directory
cd daily-diary-builder

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technology Stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## SharePoint Configuration
The application is designed to work with two SharePoint lists:

1. **InspectorDailyDiary** (main list): Contains inspection header details
   - Contract Description
   - Contract Number
   - Location
   - Date
   - Inspector on Site
   - Contract Day Number
   - Weather
   - Rain Period
   - Rain Gauge (mm)
   - Day Type
   - Notes
   - Traffic Management
   - WH&S Practices
   - Environmental/Cultural Heritage Practices

2. **InspectionActivities** (related list): Tracks specific activities with lookup to the main list
   - Location Chainage (From/To)
   - Labour Type
   - Labour Number
   - Plant Type
   - Plant Number
   - Hours
   - Idle time
   - Checklist (Y/N)
   - Issue (Y/N)
   - To be escalated (Y/N)
   - Comments

## Authentication
This app uses Microsoft Authentication Library (MSAL) for authentication with Azure AD to access SharePoint data.

## Troubleshooting GitHub Pages
If you encounter issues with the GitHub Pages deployment:
1. Ensure the repository settings have GitHub Pages enabled
2. Check that the source is set to either the root folder or /docs folder on the main branch
3. Verify that the index.html file exists in the root directory
4. Allow a few minutes for changes to propagate after pushing updates