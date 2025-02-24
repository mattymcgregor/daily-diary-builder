
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DiaryHeader() {
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">Inspection Diary Sheet</h1>
          <span className="text-sm text-muted-foreground">CAF018M</span>
        </div>
        <img 
          src="/lovable-uploads/91ce7587-ec55-4026-b06c-46c6ba0c4e6a.png" 
          alt="Queensland Government Logo"
          className="h-12 object-contain"
        />
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input id="projectName" placeholder="Enter project name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contractNo">Contract No. / Project No.</Label>
          <Input id="contractNo" placeholder="Enter contract number" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contractor">Contractor</Label>
          <Input id="contractor" placeholder="Enter contractor name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
      </CardContent>
    </Card>
  );
}
