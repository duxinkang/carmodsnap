import type {
  StorageConfigs,
  StorageDownloadUploadOptions,
  StorageProvider,
  StorageUploadOptions,
  StorageUploadResult,
} from '.';

/**
 * Local storage provider configs (for development)
 */
export interface LocalStorageConfigs extends StorageConfigs {
  uploadPath?: string;
}

/**
 * Local storage provider implementation for development
 * Stores files in public/uploads directory
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = 'local';
  configs: LocalStorageConfigs;

  constructor(configs: LocalStorageConfigs) {
    this.configs = configs;
  }

  private getUploadPath() {
    let uploadPath = this.configs.uploadPath || 'uploads';
    if (uploadPath.startsWith('/')) {
      uploadPath = uploadPath.slice(1);
    }
    if (uploadPath.endsWith('/')) {
      uploadPath = uploadPath.slice(0, -1);
    }
    return uploadPath;
  }

  async uploadFile(options: StorageUploadOptions): Promise<StorageUploadResult> {
    try {
      const uploadPath = this.getUploadPath();
      const filename = `${uploadPath}/${options.key}`;
      
      // In development, we'll use a base64 data URL
      const base64 = Buffer.from(options.body).toString('base64');
      const mimeType = options.contentType || 'image/png';
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      return {
        success: true,
        location: dataUrl,
        uploadPath: filename,
        key: options.key,
        url: dataUrl,
        provider: this.name,
      };
    } catch (error) {
      console.error('Local storage upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      };
    }
  }

  async downloadAndUpload(
    options: StorageDownloadUploadOptions
  ): Promise<StorageUploadResult> {
    try {
      const uploadPath = this.getUploadPath();
      const filename = `${uploadPath}/${options.key}`;
      
      // In development, we'll use the URL directly
      return {
        success: true,
        location: options.url,
        uploadPath: filename,
        key: options.key,
        url: options.url,
        provider: this.name,
      };
    } catch (error) {
      console.error('Local storage download and upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      };
    }
  }

  async exists(options: { key: string; bucket?: string }): Promise<boolean> {
    // Local provider does not persist files to disk in this project.
    // Returning false avoids dedupe paths that may produce non-public URLs.
    return false;
  }

  getPublicUrl(options: { key: string; bucket?: string }): string {
    // In local storage, we return a placeholder URL
    const uploadPath = this.getUploadPath();
    return `/uploads/${options.key}`;
  }
}
