import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface AdditionalInformationProps {
  onUpdate: (data: any) => void;
}

export function AdditionalInformation({ onUpdate }: AdditionalInformationProps) {
  const [additionalData, setAdditionalData] = useState({
    notes: "",
    trafficManagement: "",
    whsManagement: "",
    environmentalManagement: "",
    inspectorName: "",
    contractAdminName: ""
  });
  
  const handleChange = (id: string, value: string) => {
    setAdditionalData({
      ...additionalData,
      [id]: value
    });
    
    // Pass the updated data to parent component
    onUpdate({
      ...additionalData,
      [id]: value
    });
  };
  
  return (
    <Card className="w-full mb-6 animate-fadeIn">
      <CardHeader>
        <h2 className="text-xl font-semibold">Additional Information</h2>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Enter notes for events (delays, environmental issues, etc.)" 
            rows={4}
            value={additionalData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="trafficManagement">Traffic Management Practices</Label>
          <Textarea 
            id="trafficManagement" 
            placeholder="Enter traffic management practices" 
            rows={3}
            value={additionalData.trafficManagement}
            onChange={(e) => handleChange("trafficManagement", e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="whsManagement">WH&S Practices</Label>
          <Textarea 
            id="whsManagement" 
            placeholder="Enter workplace health and safety practices" 
            rows={3}
            value={additionalData.whsManagement}
            onChange={(e) => handleChange("whsManagement", e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="environmentalManagement">Environmental/Cultural Heritage Practices</Label>
          <Textarea 
            id="environmentalManagement" 
            placeholder="Enter environmental and cultural heritage practices" 
            rows={3}
            value={additionalData.environmentalManagement}
            onChange={(e) => handleChange("environmentalManagement", e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Attachments</Label>
          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="document-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
                >
                  <span>Upload documents</span>
                  <input id="document-upload" name="document-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PDF, DOC, XLS up to 20MB</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="inspectorSignature">Inspector Signature</Label>
            <div className="border rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Sign here</p>
            </div>
            <Input 
              id="inspectorName" 
              placeholder="Inspector Name" 
              className="mt-2" 
              value={additionalData.inspectorName}
              onChange={(e) => handleChange("inspectorName", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contractAdminSignature">Contract Administrator Signature</Label>
            <div className="border rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Sign here</p>
            </div>
            <Input 
              id="contractAdminName" 
              placeholder="Contract Administrator Name" 
              className="mt-2"
              value={additionalData.contractAdminName}
              onChange={(e) => handleChange("contractAdminName", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}