
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamMember, { TeamMemberData } from "./TeamMember";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface TeamMembersListProps {
  storyPointMappings: Record<number, number>;
  sprintConfig: { sprints: number; sprintLength: number };
}

export default function TeamMembersList({ 
  storyPointMappings, 
  sprintConfig 
}: TeamMembersListProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  const addTeamMember = () => {
    const newMember: TeamMemberData = {
      id: uuidv4(),
      name: `Team Member ${teamMembers.length + 1}`,
      weeklyCapacity: 30,
      assignedStoryPoints: {},
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (updatedMember: TeamMemberData) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-capacity-default">
          Team Members
        </CardTitle>
        <Button onClick={addTeamMember}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No team members added yet. Click the button above to add your first team member.
          </div>
        ) : (
          teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              member={member}
              onChange={updateTeamMember}
              onRemove={removeTeamMember}
              storyPointMappings={storyPointMappings}
              sprintConfig={sprintConfig}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
