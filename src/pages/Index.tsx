
import { DiaryHeader } from "@/components/DiaryHeader";
import { WeatherSection } from "@/components/WeatherSection";
import { ActivityLog } from "@/components/ActivityLog";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        <DiaryHeader />
        <WeatherSection />
        <ActivityLog />
      </div>
    </div>
  );
};

export default Index;
