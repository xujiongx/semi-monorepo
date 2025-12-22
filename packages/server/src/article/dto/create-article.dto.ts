export class CreateArticleDto {
  title!: string;
  content!: string;
  category_id!: string;
  status!: 'published' | 'draft';
}
