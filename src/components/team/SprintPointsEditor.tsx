
import { SprintPointsAssignment } from "./SprintPointsAssignment";
import { TeamMemberData } from "../types/TeamMemberTypes";

interface SprintPointsEditorProps {
  member: TeamMemberData;
  sprints: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, sprintNumber: number) => void;
}

export function SprintPointsEditor({ member, sprints, onChange }: SprintPointsEditorProps) {
  return (
    <div className="border rounded-md p-3">
      <h4 className="font-medium text-sm mb-2">Story Points per Sprint</h4>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: sprints }, (_, i) => i + 1).map((sprintNumber) => (
          <SprintPointsAssignment 
            key={`sprint-${sprintNumber}`} 
            member={member}
            sprintNumber={sprintNumber}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
