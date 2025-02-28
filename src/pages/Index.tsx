import { useState } from "react";
import { DiaryHeader } from "@/components/DiaryHeader";
import { WeatherSection } from "@/components/WeatherSection";
import { ActivityLog } from "@/components/ActivityLog";
import { AdditionalInformation } from "@/components/AdditionalInformation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createDiaryEntry, createActivity, IDiaryEntry, IActivity } from "@/lib/sharepoint";

const Index = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [diaryData, setDiaryData] = useState<any>({});
  const [weatherData, setWeatherData] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [additionalData, setAdditionalData] = useState<any>({});
  
  const handleDiaryUpdate = (data: any) => {
    setDiaryData(data);
  };
  
  const handleWeatherUpdate = (data: any) => {
    setWeatherData(data);
  };
  
  const handleActivitiesUpdate = (data: any[]) => {
    setActivities(data);
  };
  
  const handleAdditionalUpdate = (data: any) => {
    setAdditionalData(data);
  };
  
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!diaryData.contractDescription || !diaryData.contractNumber || !diaryData.date) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields in the diary header",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Format diary entry for SharePoint
      const diaryEntry: IDiaryEntry = {
        ContractDescription: diaryData.contractDescription,
        ContractNumber: diaryData.contractNumber,
        Location: diaryData.location || "",
        Date: diaryData.date,
        InspectorOnSite: diaryData.inspector || "",
        ContractDayNumber: parseInt(diaryData.contractDay) || 0,
        Weather: weatherData.weatherType || "",
        RainPeriod: weatherData.rainPeriod,
        RainGauge: parseFloat(weatherData.rainGauge) || 0,
        DayType: diaryData.dayType || "",
        Notes: additionalData.notes || "",
        TrafficManagement: additionalData.trafficManagement || "",
        WHSPractices: additionalData.whsManagement || "",
        EnvironmentalPractices: additionalData.environmentalManagement || "",
        InspectorSignature: additionalData.inspectorName || "",
        ContractAdministratorSignature: additionalData.contractAdminName || ""
      };
      
      // Save diary entry
      const savedDiary = await createDiaryEntry(diaryEntry);
      
      if (savedDiary && activities.length > 0) {
        // Save each activity
        const activityPromises = activities.map(activity => {
          const formattedActivity: IActivity = {
            DiaryId: savedDiary.Id,
            LocationFrom: activity.locationFrom || "",
            LocationTo: activity.locationTo || "",
            LabourType: activity.laborType || "",
            LabourNumber: parseInt(activity.laborNumber) || 0,
            PlantType: activity.plantType || "",
            PlantNumber: activity.plantNumber || "",
            Hours: parseFloat(activity.hours) || 0,
            IdleTime: parseFloat(activity.idleTime) || 0,
            Checklist: activity.checklist || false,
            Issue: activity.issue || false,
            ToBeEscalated: activity.escalate || false,
            Comments: activity.comments || ""
          };
          
          return createActivity(formattedActivity);
        });
        
        await Promise.all(activityPromises);
      }
      
      toast({
        title: "Success",
        description: "Diary entry saved successfully",
      });
      
    } catch (error) {
      console.error("Error saving diary:", error);
      toast({
        title: "Error saving diary",
        description: "There was an error saving your diary entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="container mx-auto px-4 space-y-6">
        <DiaryHeader onUpdate={handleDiaryUpdate} />
        <WeatherSection onUpdate={handleWeatherUpdate} />
        <ActivityLog onUpdate={handleActivitiesUpdate} />
        <AdditionalInformation onUpdate={handleAdditionalUpdate} />
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-4 shadow-lg">
          <div className="container mx-auto flex justify-end gap-4">
            <Button variant="outline" disabled={isSaving}>Save Draft</Button>
            <Button 
              onClick={handleSaveAll} 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Submit to SharePoint"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;