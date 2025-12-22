export class CreateResourceDto {
  filename: string;
  url: string;
  type: string;
  size?: number;
  tags?: string[];
}
