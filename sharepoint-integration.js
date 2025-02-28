/**
 * SharePoint Integration Module for Inspector Daily Diary
 * 
 * This module handles authentication and data operations with SharePoint lists
 * using Microsoft Graph API and MSAL authentication.
 */

// SharePoint site and list configuration
const CONFIG = {
  // Update with your actual SharePoint site URL
  sharePointSite: 'https://netorg4973613.sharepoint.com/sites/cn-21413',
  // List names in your SharePoint site
  diaryListName: 'InspectorDailyDiary',
  activitiesListName: 'InspectionActivities',
  // Microsoft Graph API endpoints
  graphEndpoint: 'https://graph.microsoft.com/v1.0',
  // Update with your registered app's client ID from Azure AD
  clientId: '5024031e-e935-4aae-851e-384167e5decb',
  // Update with your tenant ID or use 'common' for multi-tenant apps
  authority: 'https://login.microsoftonline.com/091225bf-801e-428d-b9ef-c01b6b44c31f',
  // The URL where this app is hosted (for redirect after auth)
  redirectUri: 'https://mattymcgregor.github.io/daily-diary-builder/'
};

// Initialize MSAL
let msalInstance = null;
let tokenResponse = null;

/**
 * Initialize the MSAL authentication library
 */
function initMSAL() {
  if (!msalInstance && window.msal) {
    const msalConfig = {
      auth: {
        clientId: CONFIG.clientId,
        authority: CONFIG.authority,
        redirectUri: CONFIG.redirectUri
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
      }
    };

    msalInstance = new window.msal.PublicClientApplication(msalConfig);
    
    // Check if there's a response from redirect
    console.log('Handling redirect promise...');
    msalInstance.handleRedirectPromise()
      .then(response => {
        if (response) {
          console.log('Received auth response:', response);
          tokenResponse = response;
          updateUIAfterLogin();
        } else {
          console.log('No redirect response, checking for existing accounts...');
          // Check if user is already logged in
          const accounts = msalInstance.getAllAccounts();
          console.log('Found accounts:', accounts.length);
          if (accounts.length > 0) {
            updateUIAfterLogin();
          }
        }
      })
      .catch(error => {
        console.error('Error during redirect handling:', error);
        displayError('Authentication error. Please try again.');
      });
  } else if (!window.msal) {
    loadMSALScript();
  }
}

/**
 * Load the MSAL script dynamically
 */
function loadMSALScript() {
  const script = document.createElement('script');
  script.src = 'https://alcdn.msauth.net/browser/2.32.2/js/msal-browser.min.js';
  script.async = true;
  script.onload = initMSAL;
  document.head.appendChild(script);
}

/**
 * Sign in to Microsoft 365
 */
async function signIn() {
  showLoadingIndicator('Signing in...');
  
  if (!msalInstance) {
    console.log('MSAL not initialized, initializing now...');
    initMSAL();
    return;
  }
  
  try {
    console.log('Starting sign-in process...');
    const loginRequest = {
      scopes: ['https://graph.microsoft.com/Sites.Read.All', 'https://graph.microsoft.com/Sites.ReadWrite.All']
    };
    
    console.log('Configured login request:', loginRequest);
    console.log('Redirect URI:', CONFIG.redirectUri);
    
    // Try redirect instead of popup to avoid blockers
    console.log('Initiating login redirect...');
    msalInstance.loginRedirect(loginRequest);
    console.log('Redirect initiated'); // We likely won't see this in the console as the page will redirect
    
    // The redirect will take the user away from the page and back
    // We won't reach this code until the redirect completes and
    // the user returns to the page, where handleRedirectPromise will process it
  } catch (error) {
    console.error('Sign-in failed:', error);
    displayError('Sign-in failed. Please try again: ' + error.message);
  } finally {
    hideLoadingIndicator();
  }
}

/**
 * Sign out from Microsoft 365
 */
async function signOut() {
  if (!msalInstance) return;
  
  try {
    const logoutRequest = {
      account: msalInstance.getAccountByHomeId(tokenResponse.account.homeAccountId)
    };
    
    await msalInstance.logout(logoutRequest);
  } catch (error) {
    console.error('Sign-out failed:', error);
  }
}

/**
 * Get an access token for Microsoft Graph API
 */
async function getAccessToken() {
  if (!msalInstance) {
    initMSAL();
    return null;
  }
  
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      await signIn();
      return null;
    }
    
    const silentRequest = {
      scopes: ['https://graph.microsoft.com/Sites.Read.All', 'https://graph.microsoft.com/Sites.ReadWrite.All'],
      account: accounts[0]
    };
    
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    
    if (error instanceof msal.InteractionRequiredAuthError) {
      // Use redirect for token acquisition too
      msalInstance.acquireTokenRedirect(silentRequest);
      return null; // This will redirect the user, so we won't reach here until they come back
    }
    
    return null;
  }
}

/**
 * Update UI elements after successful login
 */
function updateUIAfterLogin() {
  const accounts = msalInstance ? msalInstance.getAllAccounts() : [];
  const userInfo = accounts.length > 0 ? accounts[0] : null;
  
  const signInButton = document.getElementById('signInButton');
  const userNameElement = document.getElementById('userName');
  const signOutButton = document.getElementById('signOutButton');
  
  if (signInButton) signInButton.style.display = 'none';
  if (userNameElement && userInfo) {
    userNameElement.textContent = userInfo.name || userInfo.username;
    userNameElement.style.display = 'block';
  }
  if (signOutButton) signOutButton.style.display = 'inline-block';
  
  // Enable form elements
  enableFormElements();
}

/**
 * Enable all form input elements
 */
function enableFormElements() {
  const formElements = document.querySelectorAll('input, select, textarea, button.btn:not(#signInButton):not(#signOutButton)');
  formElements.forEach(element => {
    element.disabled = false;
  });
}

/**
 * Disable all form input elements
 */
function disableFormElements() {
  const formElements = document.querySelectorAll('input, select, textarea, button.btn:not(#signInButton):not(#signOutButton)');
  formElements.forEach(element => {
    element.disabled = true;
  });
}

/**
 * Create a new diary entry in SharePoint
 */
async function createDiaryEntry(diaryData) {
  showLoadingIndicator('Saving diary entry...');
  
  try {
    const token = await getAccessToken();
    if (!token) {
      displayError('Please sign in to save data.');
      return null;
    }
    
    // Get siteId and listId BEFORE constructing the endpoint
    const siteId = await getSiteId();
    if (!siteId) {
      displayError('Could not get site ID. Please check your permissions.');
      return null;
    }
    
    const listId = await getListId(CONFIG.diaryListName);
    if (!listId) {
      displayError(`Could not find list "${CONFIG.diaryListName}". Please check if it exists.`);
      return null;
    }
    
    const endpoint = `${CONFIG.graphEndpoint}/sites/${siteId}/lists/${listId}/items`;
    
    // Format data according to Microsoft Graph API requirements
    const formattedData = {
      fields: {
        // Map your form fields to SharePoint list fields
        Title: diaryData.contractDescription || 'Diary Entry',
        ContractDescription: diaryData.contractDescription,
        ContractNumber: diaryData.contractNumber,
        Location: diaryData.location,
        Date: new Date(diaryData.date).toISOString(),
        InspectorOnSite: diaryData.inspector,
        ContractDayNumber: parseInt(diaryData.contractDay) || 0,
        Weather: diaryData.weather,
        RainPeriod: diaryData.rainPeriod,
        RainGauge: parseFloat(diaryData.rainGauge) || 0,
        DayType: diaryData.dayType,
        Notes: diaryData.notes,
        TrafficManagement: diaryData.trafficManagement,
        WHSPractices: diaryData.whsManagement,
        EnvironmentalPractices: diaryData.environmentalManagement,
        InspectorSignature: diaryData.inspectorName,
        ContractAdministratorSignature: diaryData.contractAdminName
      }
    };
    
    console.log('Sending request to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Error creating diary entry: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createDiaryEntry:', error);
    displayError('Failed to save diary entry. Please try again.');
    return null;
  } finally {
    hideLoadingIndicator();
  }
}

/**
 * Create a new activity for a diary entry
 */
async function createActivity(activity, diaryId) {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    
    // Get siteId and listId BEFORE constructing the endpoint
    const siteId = await getSiteId();
    if (!siteId) {
      console.error('Could not get site ID for activity creation');
      return null;
    }
    
    const listId = await getListId(CONFIG.activitiesListName);
    if (!listId) {
      console.error(`Could not find list "${CONFIG.activitiesListName}" for activity creation`);
      return null;
    }
    
    const endpoint = `${CONFIG.graphEndpoint}/sites/${siteId}/lists/${listId}/items`;
    
    // Format data according to Microsoft Graph API requirements
    const formattedData = {
      fields: {
        Title: `Activity for ${diaryId}`,
        DiaryId: diaryId,
        LocationFrom: activity.locationFrom,
        LocationTo: activity.locationTo,
        LabourType: activity.laborType,
        LabourNumber: parseInt(activity.laborNumber) || 0,
        PlantType: activity.plantType,
        PlantNumber: activity.plantNumber,
        Hours: parseFloat(activity.hours) || 0,
        IdleTime: parseFloat(activity.idleTime) || 0,
        Checklist: activity.checklist,
        Issue: activity.issue,
        ToBeEscalated: activity.escalate,
        Comments: activity.comments
      }
    };
    
    console.log('Creating activity at:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Activity API Error Response:', errorText);
      throw new Error(`Error creating activity: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createActivity:', error);
    return null;
  }
}

/**
 * Get the SharePoint site ID
 */
async function getSiteId() {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    
    // Parse the SharePoint site URL to get the host and relative path
    const url = new URL(CONFIG.sharePointSite);
    const hostName = url.hostname; // e.g. "netorg4973613.sharepoint.com"
    const sitePath = url.pathname; // e.g. "/sites/cn-21413"
    
    // Format according to Microsoft Graph API requirements
    // For SharePoint sites, we need to use the format: {hostname},{sitePath}
    const siteIdentifier = `${hostName},${sitePath}`;
    const endpoint = `${CONFIG.graphEndpoint}/sites/${siteIdentifier}`;
    
    console.log('Getting site ID from:', endpoint);
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Site ID API Error Response:', errorText);
      throw new Error(`Error getting site ID: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Site data:', data);
    return data.id;
  } catch (error) {
    console.error('Error in getSiteId:', error);
    return null;
  }
}

/**
 * Get the SharePoint list ID by name
 */
async function getListId(listName) {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    
    const siteId = await getSiteId();
    if (!siteId) return null;
    
    const endpoint = `${CONFIG.graphEndpoint}/sites/${siteId}/lists?$filter=displayName eq '${listName}'`;
    
    console.log('Getting list ID from:', endpoint);
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('List ID API Error Response:', errorText);
      throw new Error(`Error getting list ID: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Lists data:', data);
    
    if (data.value && data.value.length > 0) {
      return data.value[0].id;
    }
    
    throw new Error(`List "${listName}" not found.`);
  } catch (error) {
    console.error('Error in getListId:', error);
    return null;
  }
}

/**
 * Show a loading indicator
 */
function showLoadingIndicator(message = 'Loading...') {
  let loadingElement = document.getElementById('loadingIndicator');
  
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.id = 'loadingIndicator';
    loadingElement.className = 'loading-indicator';
    
    const spinnerElement = document.createElement('div');
    spinnerElement.className = 'loading-spinner';
    
    const messageElement = document.createElement('div');
    messageElement.className = 'loading-message';
    
    loadingElement.appendChild(spinnerElement);
    loadingElement.appendChild(messageElement);
    
    document.body.appendChild(loadingElement);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .loading-message {
        color: white;
        margin-top: 10px;
        font-weight: bold;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  const messageElement = loadingElement.querySelector('.loading-message');
  if (messageElement) {
    messageElement.textContent = message;
  }
  
  loadingElement.style.display = 'flex';
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
  const loadingElement = document.getElementById('loadingIndicator');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

/**
 * Display an error message
 */
function displayError(message) {
  alert(message);
}

/**
 * Save the diary entry and all activities to SharePoint
 */
async function saveDiaryToSharePoint() {
  // Collect all form data
  const diaryData = {
    contractDescription: document.getElementById('contractDescription')?.value,
    contractNumber: document.getElementById('contractNumber')?.value,
    location: document.getElementById('location')?.value,
    date: document.getElementById('date')?.value,
    inspector: document.getElementById('inspector')?.value,
    contractDay: document.getElementById('contractDay')?.value,
    dayType: document.getElementById('dayType')?.value,
    
    // Weather data
    weather: getSelectedValueFromSelect('weatherType'),
    rainPeriod: getSelectedValueFromSelect('rainPeriod'),
    rainGauge: document.getElementById('rainGauge')?.value,
    
    // Additional data
    notes: document.getElementById('notes')?.value,
    trafficManagement: document.getElementById('trafficManagement')?.value,
    whsManagement: document.getElementById('whsManagement')?.value,
    environmentalManagement: document.getElementById('environmentalManagement')?.value,
    inspectorName: document.getElementById('inspectorName')?.value,
    contractAdminName: document.getElementById('contractAdminName')?.value
  };
  
  // Validate required fields
  if (!diaryData.contractDescription || !diaryData.contractNumber || !diaryData.date) {
    displayError('Please fill in all required fields in the diary header');
    return;
  }
  
  // Submit diary
  const savedDiary = await createDiaryEntry(diaryData);
  if (!savedDiary) return;
  
  const diaryId = savedDiary.id;
  
  // Get activities
  const activityElements = document.querySelectorAll('.activity-item');
  const activities = Array.from(activityElements).map(activityElement => {
    return {
      locationFrom: activityElement.querySelector('[id^="locationFrom-"]')?.value,
      locationTo: activityElement.querySelector('[id^="locationTo-"]')?.value,
      laborType: activityElement.querySelector('[id^="laborType-"]')?.value,
      laborNumber: activityElement.querySelector('[id^="laborNumber-"]')?.value,
      plantType: activityElement.querySelector('[id^="plantType-"]')?.value,
      plantNumber: activityElement.querySelector('[id^="plantNumber-"]')?.value,
      hours: activityElement.querySelector('[id^="hours-"]')?.value,
      idleTime: activityElement.querySelector('[id^="idleTime-"]')?.value,
      checklist: activityElement.querySelector('[id^="checklist-"]')?.checked,
      issue: activityElement.querySelector('[id^="issue-"]')?.checked,
      escalate: activityElement.querySelector('[id^="escalate-"]')?.checked,
      comments: activityElement.querySelector('[id^="comments-"]')?.value
    };
  });
  
  // Submit activities
  if (activities.length > 0) {
    showLoadingIndicator('Saving activities...');
    
    try {
      const activityPromises = activities.map(activity => createActivity(activity, diaryId));
      await Promise.all(activityPromises);
      
      alert('Diary entry saved successfully!');
      // Optional: Reset the form or redirect
      // resetForm();
    } catch (error) {
      console.error('Error saving activities:', error);
      displayError('There was an error saving some activities. Please try again.');
    } finally {
      hideLoadingIndicator();
    }
  } else {
    alert('Diary entry saved successfully!');
    // Optional: Reset the form or redirect
    // resetForm();
  }
}

/**
 * Get the selected value from a select element
 */
function getSelectedValueFromSelect(id) {
  const select = document.getElementById(id);
  return select ? select.options[select.selectedIndex]?.value : '';
}

/**
 * Reset the form after submission
 */
function resetForm() {
  // Reset input fields
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    if (input.type === 'checkbox') {
      input.checked = false;
    } else {
      input.value = '';
    }
  });
  
  // Reset date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  
  // Remove all activities except the first one
  const activityItems = document.querySelectorAll('.activity-item');
  if (activityItems.length > 1) {
    for (let i = 1; i < activityItems.length; i++) {
      activityItems[i].remove();
    }
  }
}

// Initialize the module
document.addEventListener('DOMContentLoaded', () => {
  // Load MSAL library
  loadMSALScript();
  
  // Initially disable form elements until signed in
  disableFormElements();
  
  // Attach click handlers to buttons
  const saveButton = document.querySelector('button.btn:not(.btn-outline)');
  if (saveButton) {
    saveButton.addEventListener('click', saveDiaryToSharePoint);
  }
  
  // Add event listeners to auth buttons
  const signInButton = document.getElementById('signInButton');
  if (signInButton) {
    signInButton.addEventListener('click', signIn);
  }
  
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOut);
  }
});

// Export functions for external use
window.spDiary = {
  signIn,
  signOut,
  saveDiaryToSharePoint
};