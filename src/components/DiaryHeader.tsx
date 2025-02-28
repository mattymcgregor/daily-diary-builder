import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DiaryHeaderProps {
  onUpdate: (data: any) => void;
}

export function DiaryHeader({ onUpdate }: DiaryHeaderProps) {
  const { toast } = useToast();
  const [diaryData, setDiaryData] = useState({
    contractDescription: "",
    contractNumber: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    inspector: "",
    contractDay: "",
    dayType: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDiaryData({
      ...diaryData,
      [id]: value
    });
    
    // Pass the updated data to parent component
    onUpdate({
      ...diaryData,
      [id]: value
    });
  };
  
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">Inspector Daily Diary</h1>
          <span className="text-sm text-muted-foreground">Construction Site Diary</span>
        </div>
        <img 
          src="/lovable-uploads/91ce7587-ec55-4026-b06c-46c6ba0c4e6a.png" 
          alt="Company Logo"
          className="h-12 object-contain"
        />
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="contractDescription">Contract Description</Label>
          <Input 
            id="contractDescription" 
            placeholder="Enter contract description"
            value={diaryData.contractDescription}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contractNumber">Contract Number</Label>
          <Input 
            id="contractNumber" 
            placeholder="Enter contract number"
            value={diaryData.contractNumber}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="Enter location"
            value={diaryData.location}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            value={diaryData.date}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="inspector">Inspector on Site</Label>
          <Input 
            id="inspector" 
            placeholder="Enter inspector name"
            value={diaryData.inspector}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contractDay">Contract Day Number</Label>
          <Input 
            id="contractDay" 
            type="number" 
            placeholder="Enter day number"
            value={diaryData.contractDay}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dayType">Day Type</Label>
          <Input 
            id="dayType" 
            placeholder="Enter day type (e.g., Working, RDO)"
            value={diaryData.dayType}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}