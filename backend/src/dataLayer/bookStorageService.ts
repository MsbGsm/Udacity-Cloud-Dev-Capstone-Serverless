import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { SignedUrlRequest } from '../requests/signedUrlRequest'


const XAWS = AWSXRay.captureAWS(AWS)

export class BookStorageService {

  constructor(
    private readonly bookStorageBucket = process.env.IMAGES_S3_BUCKET,
    private readonly bookUrlExpiryTime = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })
  ) {}

  getBookBucketName() {
    return this.bookStorageBucket
  }

  getBookUrlExpiryTime() {
    return this.bookUrlExpiryTime
  }

  async getUploadURL(signedUrlRequest: SignedUrlRequest) {
    return this.s3.getSignedUrl('putObject', signedUrlRequest)
  }

}