import { UploadStorageProvider } from '../types/upload';
import { UploadApiOptions, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { formatAsDataUri } from '../utils/file-upload';

export class CloudinaryProvider implements UploadStorageProvider {
	constructor(private readonly configService: ConfigService) {
		const cloudinaryConfig = this.configService.get('cloudinary');
		v2.config({
			cloud_name: cloudinaryConfig.cloudName,
			api_key: cloudinaryConfig.apiKey,
			api_secret: cloudinaryConfig.apiSecret,
		});
	}

	async uploadAsset(
		assetOrPath: string | Express.Multer.File,
		options?: UploadApiOptions,
	) {
		let assetPath = '';

		if (assetOrPath instanceof Object) {
			assetPath = formatAsDataUri(assetOrPath).content;
		} else {
			assetPath = assetOrPath;
		}

		const response = await v2.uploader.upload(assetPath, options);
		return response;
	}
	async deleteAssetsByPrefix(prefix: string) {
		const response = await v2.api.delete_resources_by_prefix(prefix);
		return response;
	}
	async deleteAsset(publicId: string) {
		const response = await v2.uploader.destroy(publicId);
		return response;
	}
}
