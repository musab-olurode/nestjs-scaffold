export interface UploadStorageProvider {
	uploadAsset: (
		asset: string | Express.Multer.File,
		options?: Record<string, unknown>,
	) => Promise<unknown>;
	deleteAsset: (id: string) => Promise<unknown>;
	deleteAssetsByPrefix: (prefix: string) => Promise<unknown>;
}
