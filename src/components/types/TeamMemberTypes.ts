
export interface TeamMemberData {
  id: string;
  name: string;
  weeklyCapacity: number;
  assignedStoryPoints: Record<string, number>;
  sprintStoryPoints?: Record<number, number>; // Points assigned per sprint
}
