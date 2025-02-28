# Deployment Instructions for GitHub Pages

Follow these steps carefully to deploy your Daily Diary Builder to GitHub Pages and embed it in SharePoint.

## Step 1: Push Changes to GitHub

```bash
# Make sure you're in the project directory
cd /mnt/c/Users/MattMcGregor/Projects/daily-diary-builder

# Add all modified files
git add .

# Commit your changes
git commit -m "Add standalone HTML version for GitHub Pages"

# Push to GitHub
git push origin main
```

## Step 2: Configure GitHub Pages

1. Go to your GitHub repository: https://github.com/MattMcGregor/daily-diary-builder
2. Click on "Settings" (tab near the top)
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "Deploy from a branch"
5. For "Branch", select "main" and "/ (root)" folder
6. Click "Save"
7. Wait for the deployment to complete (this may take a few minutes)
8. The site will be available at: https://mattymcgregor.github.io/daily-diary-builder/

## Step 3: Verify Deployment

1. Visit https://mattymcgregor.github.io/daily-diary-builder/
2. Make sure the site loads properly and you can see the form
3. If you see a blank page, check the browser console for errors:
   - Right-click on the page > Inspect > Console
   - Look for any errors and check the Network tab for failed resources

## Step 4: Embed in SharePoint

1. Go to your SharePoint page: https://netorg4973613.sharepoint.com/sites/cn-21413/SitePages/DailyDiary.aspx
2. Click "Edit" to edit the page
3. Add the "Embed" web part (you may need to search for it in the web part gallery)
4. Paste this iframe code:

```html
<iframe 
  src="https://mattymcgregor.github.io/daily-diary-builder/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  allowfullscreen
></iframe>
```

5. Enable "Resize to fit the page" option
6. Click "Publish" to save your changes

## Step 5: Integrate with SharePoint (Future Step)

To fully integrate with SharePoint, you'll need to:

1. Configure the Azure AD application registration with appropriate permissions
2. Update the auth.ts file with your client ID and tenant ID
3. Update the sharepoint.ts file with your SharePoint site URL
4. Create the SharePoint lists for storing diary entries and activities

## Troubleshooting

If GitHub Pages doesn't work:
1. Check if index.html is in the root directory
2. Wait a few minutes for changes to propagate
3. Try setting the GitHub Pages source to the /docs folder instead
4. Ensure you've pushed all your changes to the main branch

If embedding in SharePoint doesn't work:
1. Check SharePoint's Content Security Policy settings
2. Try enabling "Allow embedding this site in other websites" in SharePoint settings
3. Verify that your GitHub Pages site is publicly accessible