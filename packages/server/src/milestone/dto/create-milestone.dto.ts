export class CreateMilestoneDto {
  title: string;
  description?: string;
  date: string;
  type: string;
  category: string;
  attachments?: string[];
}
