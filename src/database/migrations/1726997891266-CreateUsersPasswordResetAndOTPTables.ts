import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersPasswordResetAndOTPTables1726997891266
	implements MigrationInterface
{
	name = 'CreateUsersPasswordResetAndOTPTables1726997891266';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identity_provider" "public"."user_identity_provider_enum", "identity_provider_id" character varying, "email" character varying NOT NULL, "password" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "permissions" text array NOT NULL, "email_verification_token" character varying, "email_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_8b068ccc9f2d780253f5d7eae3b" UNIQUE ("identity_provider_id"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_54663aeef9987efe0b4a3bda93a" UNIQUE ("email_verification_token"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" "public"."otp_reason_enum" NOT NULL, "code" character varying NOT NULL, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "password_reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_8515e60a2cc41584fa4784f52ce" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "password_reset" ADD CONSTRAINT "FK_ad88301fdc79593dd222268a8b6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "password_reset" DROP CONSTRAINT "FK_ad88301fdc79593dd222268a8b6"`,
		);
		await queryRunner.query(
			`ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`,
		);
		await queryRunner.query(`DROP TABLE "password_reset"`);
		await queryRunner.query(`DROP TABLE "otp"`);
		await queryRunner.query(`DROP TABLE "user"`);
	}
}
