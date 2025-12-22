export class Milestone {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  date: Date;
  type: string;
  category: string;
  attachments?: string[];
  created_at: Date;
}
