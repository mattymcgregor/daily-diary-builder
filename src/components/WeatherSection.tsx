
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function WeatherSection() {
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader>
        <h2 className="text-xl font-semibold">Weather Conditions</h2>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Weather Type</Label>
          <Select>
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
        <div className="grid gap-2">
          <Label>Rain Status</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select rain status" />
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
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" type="time" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="finishTime">Finish Time</Label>
          <Input id="finishTime" type="time" />
        </div>
      </CardContent>
    </Card>
  );
}
