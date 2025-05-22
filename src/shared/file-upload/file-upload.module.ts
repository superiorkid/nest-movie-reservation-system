import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
