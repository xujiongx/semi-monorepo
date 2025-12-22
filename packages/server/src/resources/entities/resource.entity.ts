export class Resource {
  id: number;
  user_id: string;
  filename: string;
  url: string;
  type: string;
  size?: number;
  tags?: string[];
  created_at: Date;
}
