import { useState, useEffect } from 'react';

// Types for SharePoint data
export interface IDiaryEntry {
  id?: string;
  ContractDescription: string;
  ContractNumber: string;
  Location: string;
  Date: string;
  InspectorOnSite: string;
  ContractDayNumber: number;
  Weather: string;
  RainPeriod?: string;
  RainGauge?: number;
  DayType: string;
  Notes?: string;
  TrafficManagement?: string;
  WHSPractices?: string;
  EnvironmentalPractices?: string;
  InspectorSignature?: string;
  ContractAdministratorSignature?: string;
}

export interface IActivity {
  id?: string;
  DiaryId: string;
  LocationFrom: string;
  LocationTo: string;
  LabourType: string;
  LabourNumber: number;
  PlantType: string;
  PlantNumber: string;
  Hours: number;
  IdleTime: number;
  Checklist: boolean;
  Issue: boolean;
  ToBeEscalated: boolean;
  Comments: string;
}

// Configuration for SharePoint connection
const CONFIG = {
  sharePointSite: 'https://netorg4973613.sharepoint.com/sites/cn-21413/', // Add your SharePoint site URL e.g., 'https://contoso.sharepoint.com/sites/mysite'
  diaryListName: 'InspectorDailyDiary',
  activitiesListName: 'InspectionActivities',
};

// Import authentication functions
import { getAccessToken } from './auth';

// Helper function to get auth token
async function getAuthToken() {
  return await getAccessToken();
}

// API functions for Diary entries
export async function getDiaryEntries() {
  try {
    const token = await getAuthToken();
    const endpoint = `${CONFIG.sharePointSite}/_api/web/lists/getbytitle('${CONFIG.diaryListName}')/items`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching diary entries: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error in getDiaryEntries:', error);
    throw error;
  }
}

export async function createDiaryEntry(diary: IDiaryEntry) {
  try {
    const token = await getAuthToken();
    const endpoint = `${CONFIG.sharePointSite}/_api/web/lists/getbytitle('${CONFIG.diaryListName}')/items`;
    
    // Format data for SharePoint
    const formattedData = {
      ...diary,
      // Format date to ISO string if needed
      Date: new Date(diary.Date).toISOString()
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-HTTP-Method': 'POST'
      },
      body: JSON.stringify(formattedData)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating diary entry: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createDiaryEntry:', error);
    throw error;
  }
}

// API functions for Activities
export async function getActivitiesForDiary(diaryId: string) {
  try {
    const token = await getAuthToken();
    const endpoint = `${CONFIG.sharePointSite}/_api/web/lists/getbytitle('${CONFIG.activitiesListName}')/items?$filter=DiaryId eq '${diaryId}'`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching activities: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error in getActivitiesForDiary:', error);
    throw error;
  }
}

export async function createActivity(activity: IActivity) {
  try {
    const token = await getAuthToken();
    const endpoint = `${CONFIG.sharePointSite}/_api/web/lists/getbytitle('${CONFIG.activitiesListName}')/items`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-HTTP-Method': 'POST'
      },
      body: JSON.stringify(activity)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating activity: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createActivity:', error);
    throw error;
  }
}

// Custom hook for SharePoint data
export function useSharePointData<T>(fetchFunction: () => Promise<T[]>, dependencies: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, dependencies);

  return { data, isLoading, error };
}

// File upload function for SharePoint document library
export async function uploadFileToSharePoint(file: File, folderPath: string) {
  try {
    const token = await getAuthToken();
    const endpoint = `${CONFIG.sharePointSite}/_api/web/getFolderByServerRelativeUrl('${folderPath}')/Files/add(url='${file.name}', overwrite=true)`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-HTTP-Method': 'POST'
      },
      body: file
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in uploadFileToSharePoint:', error);
    throw error;
  }
}