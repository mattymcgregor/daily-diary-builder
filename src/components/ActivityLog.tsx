
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export function ActivityLog() {
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 p-4 border rounded-lg">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="activity">Activity</Label>
                <Input id="activity" placeholder="Enter activity description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="laborType">Labor Type</Label>
                <Input id="laborType" placeholder="Enter labor type" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Hours</Label>
                <Input id="hours" type="number" placeholder="Enter hours worked" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Photos</Label>
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
