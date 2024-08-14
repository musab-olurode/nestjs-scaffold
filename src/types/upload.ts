export interface UploadStorageProvider {
	uploadAsset: (
		asset: string | Express.Multer.File,
		options?: Record<string, any>,
	) => Promise<any>;
	deleteAsset: (id: string) => Promise<any>;
	deleteAssetsByPrefix: (prefix: string) => Promise<any>;
}
