
import { useState } from "react";
import SprintConfig from "@/components/SprintConfig";
import TeamMembersList from "@/components/TeamMembersList";
import StoryPointInfo from "@/components/StoryPointInfo";
import TeamCapacitySummary from "@/components/TeamCapacitySummary";
import SprintPlanning from "@/components/SprintPlanning";
import { Separator } from "@/components/ui/separator";
import { TeamMemberData } from "@/components/types/TeamMemberTypes";

const Index = () => {
  const [sprintConfig, setSprintConfig] = useState({
    sprints: 1,
    sprintLength: 2,
    startDate: null as Date | null,
    dueDate: null as Date | null,
    velocity: 2, // Changed to 2 hours per point
  });
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  // Story point to hours mapping
  const [storyPointMappings, setStoryPointMappings] = useState<Record<number, number>>({
    1: 2,   // 1 point = 2 hours
    2: 4,   // 2 points = 4 hours
    3: 8,   // 3 points = 8 hours
    5: 16,  // 5 points = 16 hours
    8: 32,  // 8 points = 32 hours
  });

  const handleConfigChange = (
    sprints: number, 
    sprintLength: number, 
    startDate: Date | null, 
    dueDate: Date | null,
    velocity: number
  ) => {
    setSprintConfig({ sprints, sprintLength, startDate, dueDate, velocity });
  };

  const handleTeamMembersChange = (updatedMembers: TeamMemberData[]) => {
    setTeamMembers(updatedMembers);
  };

  const handleStoryPointMappingsChange = (updatedMappings: Record<number, number>) => {
    setStoryPointMappings(updatedMappings);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <SprintConfig onConfigChange={handleConfigChange} />
            
            {teamMembers.length > 0 && (
              <div className="mt-6">
                <TeamCapacitySummary 
                  teamMembers={teamMembers}
                  storyPointMappings={storyPointMappings}
                  sprintConfig={sprintConfig}
                />
              </div>
            )}
          </div>
          
          <div className="md:col-span-1">
            <StoryPointInfo 
              storyPointMappings={storyPointMappings} 
              onMappingsChange={handleStoryPointMappingsChange}
            />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="mb-8">
          <SprintPlanning 
            sprintConfig={sprintConfig}
            teamMembers={teamMembers}
          />
        </div>
        
        <div className="mb-8">
          <TeamMembersList 
            storyPointMappings={storyPointMappings} 
            sprintConfig={sprintConfig} 
            onTeamMembersChange={handleTeamMembersChange}
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
