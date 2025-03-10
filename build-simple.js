import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy public directory contents to dist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('Copying public directory...');
  
  // On Windows, use xcopy
  try {
    execSync('xcopy /E /I /Y .\\public .\\dist\\public');
    console.log('Public directory copied successfully');
  } catch (err) {
    console.error('Error copying public directory:', err);
  }
}

// Copy index.html
const indexHtml = path.join(__dirname, 'index.html');
if (fs.existsSync(indexHtml)) {
  console.log('Copying index.html...');
  fs.copyFileSync(indexHtml, path.join(distDir, 'index.html'));
  console.log('index.html copied successfully');
}

// Create a minimal app.css
console.log('Creating minimal app.css...');
fs.writeFileSync(
  path.join(distDir, 'app.css'),
  `/* Minimal styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 0;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  border: none;
}

.btn:hover {
  background-color: #0060df;
}

.btn-outline {
  background-color: transparent;
  color: #0070f3;
  border: 1px solid #0070f3;
}

.btn-outline:hover {
  background-color: #f9f9f9;
}
`
);
console.log('app.css created successfully');

// Create a minimal app.js
console.log('Creating minimal app.js...');
fs.writeFileSync(
  path.join(distDir, 'app.js'),
  `// Minimal placeholder app
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  if (root) {
    root.innerHTML = \`
      <div class="container">
        <h1>Inspector Daily Diary</h1>
        <div class="card">
          <div class="header">
            <h2>Diary Header</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Contract Description</label>
            <input type="text" class="form-input" placeholder="Enter contract description" />
          </div>
          <div class="form-group">
            <label class="form-label">Contract Number</label>
            <input type="text" class="form-input" placeholder="Enter contract number" />
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" />
          </div>
        </div>
        
        <div class="card">
          <div class="header">
            <h2>Weather Conditions</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Weather Type</label>
            <select class="form-input">
              <option>Dry / Hot</option>
              <option>Humid</option>
              <option>Overcast</option>
              <option>Windy</option>
              <option>Light Rain</option>
              <option>Heavy Rain</option>
              <option>Storms</option>
            </select>
          </div>
        </div>
        
        <div class="card">
          <div class="header">
            <h2>Activity Log</h2>
            <button class="btn btn-outline">Add Activity</button>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" placeholder="Enter location" />
          </div>
          <div class="form-group">
            <label class="form-label">Comments</label>
            <textarea class="form-input" rows="2"></textarea>
          </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
          <button class="btn btn-outline" style="margin-right: 1rem;">Save Draft</button>
          <button class="btn">Submit to SharePoint</button>
        </div>
      </div>
    \`;
  }
  
  // Display a message about SharePoint integration
  console.log('SharePoint integration: This is a placeholder. The actual app would connect to SharePoint.');
});

// Mock SharePoint auth to avoid errors
window.msal = {
  PublicClientApplication: function() {
    return {
      loginRedirect: function() { console.log('Mock: loginRedirect called'); },
      handleRedirectPromise: function() { 
        console.log('Mock: handleRedirectPromise called'); 
        return Promise.resolve(null);
      },
      getAllAccounts: function() { return []; }
    };
  }
};
`
);
console.log('app.js created successfully');

// Create html file
console.log('Creating minimal SharePoint-ready HTML file...');
fs.writeFileSync(
  path.join(distDir, 'sharepoint.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inspector Daily Diary</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>
`
);
console.log('sharepoint.html created successfully');

console.log('\nBuild completed! A simplified version of the app is available in the dist directory.');
console.log('\nTo integrate with SharePoint:');
console.log('1. Upload the contents of the dist directory to a SharePoint document library');
console.log('2. Add a Script Editor web part to your SharePoint page');
console.log('3. Reference the uploaded app.js and app.css files in the Script Editor');
console.log('\nExample Script Editor content:');
console.log(`<link rel="stylesheet" href="/sites/your-site/SiteAssets/DiaryApp/app.css">
<div id="root"></div>
<script src="/sites/your-site/SiteAssets/DiaryApp/app.js"></script>`);