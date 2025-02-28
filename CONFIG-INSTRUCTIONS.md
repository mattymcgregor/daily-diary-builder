# SharePoint Integration Configuration Instructions

To connect the Inspector Daily Diary to your SharePoint site, you need to update the configuration in `sharepoint-integration.js`.

## Step 1: Register an Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations" → "New registration"
3. Enter a name for your application (e.g., "Inspector Daily Diary")
4. Select "Accounts in this organizational directory only (Single tenant)"
5. Set the Redirect URI to "Web" and use your application URL: `https://mattymcgregor.github.io/daily-diary-builder/`
6. Click "Register"

## Step 2: Configure API Permissions

1. In your new app registration, go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph" → "Delegated permissions"
4. Add the following permissions:
   - `Sites.Read.All` (Read items in all site collections)
   - `Sites.ReadWrite.All` (Edit or delete items in all site collections)
5. Click "Add permissions"
6. Click "Grant admin consent"

## Step 3: Get Configuration Information

1. From your app registration page, note the following:
   - **Application (client) ID**
   - **Directory (tenant) ID**

## Step 4: Update Configuration in Your Application

Open the `sharepoint-integration.js` file and update the CONFIG object:

```javascript
const CONFIG = {
  // Update with your actual SharePoint site URL
  sharePointSite: 'https://netorg4973613.sharepoint.com/sites/cn-21413',
  // List names in your SharePoint site
  diaryListName: 'InspectorDailyDiary',
  activitiesListName: 'InspectionActivities',
  // Microsoft Graph API endpoints
  graphEndpoint: 'https://graph.microsoft.com/v1.0',
  // Update with your registered app's client ID from Azure AD
  clientId: 'YOUR_APPLICATION_CLIENT_ID_HERE',
  // Update with your tenant ID
  authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID_HERE',
  // The URL where this app is hosted
  redirectUri: 'https://mattymcgregor.github.io/daily-diary-builder/'
};
```

Replace:
- `YOUR_APPLICATION_CLIENT_ID_HERE` with the **Application (client) ID** from Step 3
- `YOUR_TENANT_ID_HERE` with the **Directory (tenant) ID** from Step 3
- Update `sharePointSite` if your site URL is different
- Update `diaryListName` and `activitiesListName` if your SharePoint lists have different names
- Update `redirectUri` if your application is hosted somewhere else

## Step 5: Create SharePoint Lists

In your SharePoint site, create two lists:

1. **InspectorDailyDiary** with the following columns:
   - Title (default)
   - ContractDescription (Single line of text)
   - ContractNumber (Single line of text)
   - Location (Single line of text)
   - Date (Date and Time)
   - InspectorOnSite (Single line of text)
   - ContractDayNumber (Number)
   - Weather (Choice)
   - RainPeriod (Choice)
   - RainGauge (Number)
   - DayType (Single line of text)
   - Notes (Multiple lines of text)
   - TrafficManagement (Multiple lines of text)
   - WHSPractices (Multiple lines of text)
   - EnvironmentalPractices (Multiple lines of text)
   - InspectorSignature (Single line of text)
   - ContractAdministratorSignature (Single line of text)

2. **InspectionActivities** with the following columns:
   - Title (default)
   - DiaryId (Lookup to InspectorDailyDiary list)
   - LocationFrom (Single line of text)
   - LocationTo (Single line of text)
   - LabourType (Single line of text)
   - LabourNumber (Number)
   - PlantType (Single line of text)
   - PlantNumber (Single line of text)
   - Hours (Number)
   - IdleTime (Number)
   - Checklist (Yes/No)
   - Issue (Yes/No)
   - ToBeEscalated (Yes/No)
   - Comments (Multiple lines of text)

## Step 6: Deploy and Test

1. Push your changes to GitHub
2. Wait for the GitHub Pages deployment to complete
3. Open your application in a browser
4. Sign in with your Microsoft 365 account
5. Fill out a diary entry and submit
6. Verify the data is saved to your SharePoint lists

## Troubleshooting

If you encounter authentication issues:
1. Double-check your client ID and tenant ID
2. Ensure your redirect URI matches exactly in both Azure AD and in the code
3. Check that all required permissions are granted
4. Look at the browser console for specific error messages

If you encounter API issues:
1. Verify your SharePoint site URL is correct
2. Ensure the list names match exactly
3. Check that you have permission to access the site and lists