import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadImage(file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const apiKey = this.configService.get<string>('IMG_BB_API_KEY');
    if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY_HERE') {
        throw new InternalServerErrorException('ImgBB API Key is not configured in .env file');
    }

    // Convert buffer to base64
    const base64Image = file.buffer.toString('base64');

    // Create FormData
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Image);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Upload failed');
      }

      return {
        code: 0,
        data: {
          url: result.data.url,
          display_url: result.data.display_url,
          delete_url: result.data.delete_url,
          filename: result.data.title,
          size: result.data.size,
          time: result.data.time,
          expiration: result.data.expiration,
        },
      };
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw new InternalServerErrorException('Upload failed: ' + error.message);
    }
  }
}
