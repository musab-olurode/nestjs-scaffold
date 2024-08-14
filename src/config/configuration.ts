import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface DatabaseConfig {
	connection: PostgresConnectionOptions['type'];
	url: string;
	host: string;
	port: number;
	name: string;
	username: string;
	password: string;
	synchronize: boolean;
	entities: string;
	migrations: string;
	migrationsDir: string;
	charset: string;
	collation: string;
}

export default () => ({
	nodeEnv: process.env.NODE_ENV,
	appUrl: process.env.APP_URL,
	clientUrl: process.env.CLIENT_URL,
	debugClientUrl: process.env.DEBUG_CLIENT_URL,
	port: parseInt(process.env.PORT, 10) || 5000,
	database: {
		connection: process.env.TYPEORM_CONNECTION,
		url: process.env.TYPEORM_URL,
		host: process.env.TYPEORM_HOST,
		port: parseInt(process.env.TYPEORM_PORT, 10) || 3306,
		name: process.env.TYPEORM_DATABASE,
		username: process.env.TYPEORM_USERNAME,
		password: process.env.TYPEORM_PASSWORD,
		synchronize: JSON.parse(process.env.TYPEORM_SYNCHRONIZE),
		entities: process.env.TYPEORM_ENTITIES,
		migrations: process.env.TYPEORM_MIGRATIONS,
		migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
		charset: process.env.TYPEORM_CHARSET,
		collation: process.env.TYPEORM_COLLATION,
	} as DatabaseConfig,
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRE,
		refreshSecret: process.env.REFRESH_JWT_SECRET,
		refreshExpiresIn: process.env.REFRESH_JWT_EXPIRE,
		cookieExpire: process.env.JWT_COOKIE_EXPIRE,
	},
	oauth: {
		googleClientId: process.env.OAUTH_GOOGLE_ID,
		googleClientSecret: process.env.OAUTH_GOOGLE_SECRET,
		twitterConsumerKey: process.env.OAUTH_TWITTER_CONSUMER_KEY,
		twitterConsumerSecret: process.env.OAUTH_TWITTER_CONSUMER_SECRET,
	},
	mail: {
		fromEmail: process.env.FROM_EMAIL,
		fromName: process.env.FROM_NAME,
		smtpHost: process.env.SMTP_HOST,
		smtpPort: process.env.SMTP_PORT,
		smtpEmail: process.env.SMTP_EMAIL,
		smtpPassword: process.env.SMTP_PASSWORD,
	},
	cloudinary: {
		cloudName: process.env.CLOUD_NAME,
		cloudApiKey: process.env.CLOUD_API_KEY,
		cloudApiSecret: process.env.CLOUD_API_SECRET,
		cloudinaryUrl: process.env.CLOUDINARY_URL,
	},
	passportSessionSecret: process.env.PASSPORT_SESSION_SECRET,
	maxFileUploadSizeInBytes: parseInt(process.env.MAX_FILE_UPLOAD_SIZE_IN_BYTES),
	secureTokenExpiry: parseInt(process.env.SECURE_TOKEN_EXPIRY),
	auth: {
		superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
		superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
	},
});
