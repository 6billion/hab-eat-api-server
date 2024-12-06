import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(private readonly config: ConfigService) {}

  private readonly s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: this.config.get('AWS_DEFAULT_REGION') || 'ap-northeast-2',
    secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
  });

  makePutImagePreSignedUrl(bucket: string, key: string, expires: number) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires,
    });
  }
}
