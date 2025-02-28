import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Trash2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

type Activity = {
  id: string;
  locationFrom: string;
  locationTo: string;
  laborType: string;
  laborNumber: string;
  plantType: string;
  plantNumber: string;
  hours: string;
  idleTime: string;
  checklist: boolean;
  issue: boolean;
  escalate: boolean;
  comments: string;
};

interface ActivityLogProps {
  onUpdate: (activities: Activity[]) => void;
}

export function ActivityLog({ onUpdate }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: Date.now().toString(),
      locationFrom: "",
      locationTo: "",
      laborType: "",
      laborNumber: "",
      plantType: "",
      plantNumber: "",
      hours: "",
      idleTime: "",
      checklist: false,
      issue: false,
      escalate: false,
      comments: ""
    }
  ]);

  // Report activities to parent component on change
  useEffect(() => {
    onUpdate(activities);
  }, [activities, onUpdate]);

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        id: Date.now().toString(),
        locationFrom: "",
        locationTo: "",
        laborType: "",
        laborNumber: "",
        plantType: "",
        plantNumber: "",
        hours: "",
        idleTime: "",
        checklist: false,
        issue: false,
        escalate: false,
        comments: ""
      }
    ]);
  };

  const removeActivity = (id: string) => {
    if (activities.length > 1) {
      setActivities(activities.filter(activity => activity.id !== id));
    }
  };

  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    setActivities(
      activities.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <Button variant="outline" size="sm" onClick={addActivity}>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="grid gap-4 p-4 border rounded-lg relative">
              {activities.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeActivity(activity.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              
              <div className="font-medium text-sm text-gray-500">Activity {index + 1}</div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`locationFrom-${activity.id}`}>Location Chainage From</Label>
                  <Input 
                    id={`locationFrom-${activity.id}`} 
                    value={activity.locationFrom}
                    onChange={(e) => updateActivity(activity.id, "locationFrom", e.target.value)}
                    placeholder="Enter starting location" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`locationTo-${activity.id}`}>Location Chainage To</Label>
                  <Input 
                    id={`locationTo-${activity.id}`} 
                    value={activity.locationTo}
                    onChange={(e) => updateActivity(activity.id, "locationTo", e.target.value)}
                    placeholder="Enter ending location" 
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`laborType-${activity.id}`}>Labour Type</Label>
                  <Input 
                    id={`laborType-${activity.id}`} 
                    value={activity.laborType}
                    onChange={(e) => updateActivity(activity.id, "laborType", e.target.value)}
                    placeholder="Enter labor type" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`laborNumber-${activity.id}`}>Labour Number</Label>
                  <Input 
                    id={`laborNumber-${activity.id}`} 
                    value={activity.laborNumber}
                    onChange={(e) => updateActivity(activity.id, "laborNumber", e.target.value)}
                    type="number" 
                    placeholder="Enter number of laborers" 
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`plantType-${activity.id}`}>Plant Type</Label>
                  <Input 
                    id={`plantType-${activity.id}`} 
                    value={activity.plantType}
                    onChange={(e) => updateActivity(activity.id, "plantType", e.target.value)}
                    placeholder="Enter plant type" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`plantNumber-${activity.id}`}>Plant Number</Label>
                  <Input 
                    id={`plantNumber-${activity.id}`} 
                    value={activity.plantNumber}
                    onChange={(e) => updateActivity(activity.id, "plantNumber", e.target.value)}
                    placeholder="Enter plant number" 
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`hours-${activity.id}`}>Hours</Label>
                  <Input 
                    id={`hours-${activity.id}`} 
                    value={activity.hours}
                    onChange={(e) => updateActivity(activity.id, "hours", e.target.value)}
                    type="number" 
                    step="0.5"
                    placeholder="Enter hours worked" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`idleTime-${activity.id}`}>Idle Time</Label>
                  <Input 
                    id={`idleTime-${activity.id}`} 
                    value={activity.idleTime}
                    onChange={(e) => updateActivity(activity.id, "idleTime", e.target.value)}
                    type="number" 
                    step="0.5"
                    placeholder="Enter idle hours" 
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`checklist-${activity.id}`} 
                    checked={activity.checklist}
                    onCheckedChange={(checked) => 
                      updateActivity(activity.id, "checklist", checked === true)
                    }
                  />
                  <Label htmlFor={`checklist-${activity.id}`}>Checklist (Y/N)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`issue-${activity.id}`} 
                    checked={activity.issue}
                    onCheckedChange={(checked) => 
                      updateActivity(activity.id, "issue", checked === true)
                    }
                  />
                  <Label htmlFor={`issue-${activity.id}`}>Issue (Y/N)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`escalate-${activity.id}`} 
                    checked={activity.escalate}
                    onCheckedChange={(checked) => 
                      updateActivity(activity.id, "escalate", checked === true)
                    }
                  />
                  <Label htmlFor={`escalate-${activity.id}`}>To be escalated (Y/N)</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`comments-${activity.id}`}>Comments</Label>
                <Textarea 
                  id={`comments-${activity.id}`} 
                  value={activity.comments}
                  onChange={(e) => updateActivity(activity.id, "comments", e.target.value)}
                  placeholder="Enter any comments or notes" 
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>Photos</Label>
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor={`file-upload-${activity.id}`}
                        className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input id={`file-upload-${activity.id}`} name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}