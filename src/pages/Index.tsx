
import { useState } from "react";
import SprintConfig from "@/components/SprintConfig";
import TeamMembersList from "@/components/TeamMembersList";
import StoryPointInfo from "@/components/StoryPointInfo";
import { TeamMemberData } from "@/components/TeamMember";
import TeamCapacitySummary from "@/components/TeamCapacitySummary";

const Index = () => {
  const [sprintConfig, setSprintConfig] = useState({
    sprints: 1,
    sprintLength: 2,
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  // Story point to hours mapping
  const storyPointMappings: Record<number, number> = {
    1: 2,   // 1 point = 2 hours
    2: 4,   // 2 points = 4 hours
    3: 8,   // 3 points = 8 hours
    5: 16,  // 5 points = 16 hours
  };

  const handleConfigChange = (sprints: number, sprintLength: number) => {
    setSprintConfig({ sprints, sprintLength });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-capacity-default">Sprint Capacity Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Plan your team's sprint capacity and workload distribution
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SprintConfig onConfigChange={handleConfigChange} />
          </div>
          
          <div className="md:col-span-1">
            <StoryPointInfo storyPointMappings={storyPointMappings} />
          </div>
        </div>
        
        <div className="mt-8">
          <TeamMembersList 
            storyPointMappings={storyPointMappings} 
            sprintConfig={sprintConfig} 
          />
        </div>
        
        <div className="mt-8">
          <TeamCapacitySummary 
            teamMembers={teamMembers}
            storyPointMappings={storyPointMappings}
            sprintConfig={sprintConfig}
          />
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sprint Capacity Calculator | Built with Lovable
        </div>
      </footer>
    </div>
  );
};

export default Index;
