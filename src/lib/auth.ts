import * as msal from "@azure/msal-browser";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: "5024031e-e935-4aae-851e-384167e5decb", // Replace with your Azure AD application's client ID
    authority: "https://login.microsoftonline.com/091225bf-801e-428d-b9ef-c01b6b44c31f", // Use common for multi-tenant apps
    redirectUri: "https://netorg4973613.sharepoint.com/sites/cn-21413/SitePages/DailyDiary.aspx", // Redirect to the same origin after authentication
  },
  cache: {
    cacheLocation: "sessionStorage", // Use sessionStorage for better security
    storeAuthStateInCookie: false, // Do not use cookies
  },
};

// Create a new MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Define the scopes needed for SharePoint access
const scopes = ["https://graph.microsoft.com/Sites.Read.All", "https://graph.microsoft.com/Sites.ReadWrite.All"];

// Login function
export async function login() {
  try {
    const loginRequest = {
      scopes: scopes,
      prompt: "select_account",
    };
    
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

// Logout function
export function logout() {
  msalInstance.logout();
}

// Get access token for API calls
export async function getAccessToken() {
  try {
    const accounts = msalInstance.getAllAccounts();
    
    // If no accounts, redirect to login
    if (accounts.length === 0) {
      await login();
      return null;
    }
    
    // Try to acquire token silently
    const silentRequest = {
      scopes: scopes,
      account: accounts[0],
    };
    
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    
    // If silent request fails, try redirect
    if (error instanceof msal.InteractionRequiredAuthError) {
      msalInstance.acquireTokenRedirect({
        scopes: scopes,
      });
    }
    
    throw error;
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
}

// Initialize authentication handling
export function initAuth() {
  // Handle redirect response
  msalInstance.handleRedirectPromise()
    .then(response => {
      // Handle successful login
      if (response !== null) {
        console.log("Login successful");
      }
    })
    .catch(error => {
      console.error("Error during redirect handling:", error);
    });
}