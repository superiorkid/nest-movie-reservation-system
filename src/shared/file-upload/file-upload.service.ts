import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { MemoryStoredFile } from 'nestjs-form-data';
import { join } from 'path';

@Injectable()
export class FileUploadService implements OnModuleInit {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async onModuleInit() {
    await this.createUploadDir();
  }

  private async createUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: MemoryStoredFile): Promise<string> {
    const fileExt = file.originalName.split('.').pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = join(this.uploadDir, fileName);

    await writeFile(filePath, file.buffer);
    return fileName;
  }

  async delete(fileName: string): Promise<void> {
    const filePath = join(this.uploadDir, fileName);
    await rm(filePath, { force: true });
  }
}
