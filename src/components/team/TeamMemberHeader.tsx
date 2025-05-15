
import { Button } from "@/components/ui/button";
import { TeamMemberData } from "../types/TeamMemberTypes";

interface TeamMemberHeaderProps {
  member: TeamMemberData;
  isEditing: boolean;
  tempName: string;
}

export function TeamMemberHeader({ 
  member, 
  isEditing,
  tempName
}: TeamMemberHeaderProps) {
  return (
    <h3 className="font-bold text-lg">
      {isEditing ? tempName || member.name : member.name}
    </h3>
  );
}
