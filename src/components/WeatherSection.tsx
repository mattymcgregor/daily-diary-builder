import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface WeatherSectionProps {
  onUpdate: (data: any) => void;
}

export function WeatherSection({ onUpdate }: WeatherSectionProps) {
  const [weatherData, setWeatherData] = useState({
    weatherType: "",
    rainPeriod: "",
    rainGauge: "",
    startTime: "",
    finishTime: ""
  });
  
  const showRainFields = weatherData.weatherType === "light-rain" || 
                         weatherData.weatherType === "heavy-rain" || 
                         weatherData.weatherType === "storms";
  
  const handleChange = (id: string, value: string) => {
    setWeatherData({
      ...weatherData,
      [id]: value
    });
    
    // Pass the updated data to parent component
    onUpdate({
      ...weatherData,
      [id]: value
    });
  };
  
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader>
        <h2 className="text-xl font-semibold">Weather Conditions</h2>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Weather Type</Label>
          <Select 
            onValueChange={(value) => handleChange("weatherType", value)}
            value={weatherData.weatherType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weather condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dry">Dry / Hot</SelectItem>
              <SelectItem value="humid">Humid</SelectItem>
              <SelectItem value="overcast">Overcast</SelectItem>
              <SelectItem value="windy">Windy</SelectItem>
              <SelectItem value="light-rain">Light Rain</SelectItem>
              <SelectItem value="heavy-rain">Heavy Rain</SelectItem>
              <SelectItem value="storms">Storms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {showRainFields && (
          <>
            <div className="grid gap-2">
              <Label>Rain Period</Label>
              <Select 
                onValueChange={(value) => handleChange("rainPeriod", value)}
                value={weatherData.rainPeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rain period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nil">Nil</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="all-day">All Day</SelectItem>
                  <SelectItem value="intermittent">Intermittent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rainGauge">Rain Gauge (mm)</Label>
              <Input 
                id="rainGauge" 
                type="number" 
                placeholder="Enter rainfall in mm" 
                value={weatherData.rainGauge}
                onChange={(e) => handleChange("rainGauge", e.target.value)}
              />
            </div>
          </>
        )}
        
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input 
            id="startTime" 
            type="time" 
            value={weatherData.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="finishTime">Finish Time</Label>
          <Input 
            id="finishTime" 
            type="time" 
            value={weatherData.finishTime}
            onChange={(e) => handleChange("finishTime", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}