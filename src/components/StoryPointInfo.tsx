
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StoryPointInfoProps {
  storyPointMappings: Record<number, number>;
}

export default function StoryPointInfo({ storyPointMappings }: StoryPointInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Story Point Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story Points</TableHead>
                <TableHead>Estimated Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(storyPointMappings).map(([points, hours]) => (
                <TableRow key={points}>
                  <TableCell>{points}</TableCell>
                  <TableCell>{hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
