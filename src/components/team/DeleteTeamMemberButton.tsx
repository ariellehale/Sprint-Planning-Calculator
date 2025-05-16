
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteTeamMemberButtonProps {
  onDelete: () => void;
  isEditing: boolean;
}

export function DeleteTeamMemberButton({ onDelete, isEditing }: DeleteTeamMemberButtonProps) {
  if (!isEditing) return null;
  
  return (
    <div className="mt-4">
      <Button 
        variant="destructive" 
        onClick={onDelete}
        className="bg-[#ea384c] hover:bg-[#d32f2f] text-white"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete Team Member
      </Button>
    </div>
  );
}
