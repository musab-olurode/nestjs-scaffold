import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAuthAndOTPTables1747581452841
	implements MigrationInterface
{
	name = 'CreateUserAuthAndOTPTables1747581452841';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "image" character varying, "role" character varying NOT NULL DEFAULT 'user', "banned" boolean NOT NULL DEFAULT false, "banReason" character varying, "banExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TYPE "public"."otp_reason_enum" AS ENUM('PIN_RESET')`,
		);
		await queryRunner.query(
			`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" "public"."otp_reason_enum" NOT NULL, "code" character varying NOT NULL, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" character varying NOT NULL, "value" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "ipAddress" character varying, "userAgent" character varying, "impersonatedBy" character varying, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" character varying NOT NULL, "providerId" character varying NOT NULL, "accessToken" character varying, "refreshToken" character varying, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, "scope" character varying, "idToken" character varying, "password" character varying, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
		);
		await queryRunner.query(
			`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
		);
		await queryRunner.query(
			`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`,
		);
		await queryRunner.query(`DROP TABLE "account"`);
		await queryRunner.query(`DROP TABLE "session"`);
		await queryRunner.query(`DROP TABLE "verification"`);
		await queryRunner.query(`DROP TABLE "otp"`);
		await queryRunner.query(`DROP TYPE "public"."otp_reason_enum"`);
		await queryRunner.query(`DROP TABLE "user"`);
	}
}
