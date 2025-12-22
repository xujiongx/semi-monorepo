import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { TimeTrackModule } from './time-track/time-track.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ArticleModule,
    UploadModule,
    TimeTrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
