import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { DatabaseType } from 'typeorm';
import { DatabaseTypes } from '../enum/database-type.enum';
import { ValidateEnumErrorMessageTemplate } from '../helpers/error-message-template';

export class ConfigDto {
  /********************
   * Database typeorm *
   ********************/
  @IsString()
  @IsEnum(DatabaseTypes, { message: ValidateEnumErrorMessageTemplate })
  TYPEORM_TYPE!: DatabaseType;

  @IsString()
  @IsNotEmpty()
  TYPEORM_HOST!: string;

  @IsNumber()
  @IsNotEmpty()
  TYPEORM_PORT!: number;

  @IsString()
  @IsNotEmpty()
  TYPEORM_DATABASE!: string;

  @IsString()
  @IsNotEmpty()
  TYPEORM_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  TYPEORM_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  TYPEORM_SYNC!: string;

  @IsString()
  @IsNotEmpty()
  TYPEORM_SSL_ON!: string;

  @IsString()
  @IsOptional()
  TYPEORM_SSL_CA!: string;

  @IsString()
  @IsOptional()
  TYPEORM_SSL_KEY!: string;

  @IsString()
  @IsOptional()
  TYPEORM_SSL_CERT!: string;

  /*********
   * Redis *
   *********/
  @IsOptional()
  @IsString()
  REDIS_PROTOCOL!: string;

  @IsOptional()
  @IsString()
  REDIS_USERNAME!: string;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  REDIS_PORT!: number;

  @IsOptional()
  @IsNumber()
  REDIS_DB!: number;
  /************************
   * Notification service *
   ************************/
  @IsString()
  @IsNotEmpty()
  NOTIFICATIN_MS_URL!: string;

  @IsString()
  @IsOptional()
  NOTIFICATION_CHANNEL_NAME!: string;

  @IsOptional()
  @IsString()
  NOTIFICATION_BOT_ICON!: string;

  @IsOptional()
  @IsBoolean()
  NOTIFICATION_DISABLED!: boolean;

  /* Allow any other ENV */
  [key: string]: any | undefined;
}
