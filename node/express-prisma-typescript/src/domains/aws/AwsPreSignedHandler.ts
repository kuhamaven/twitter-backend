import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const BUCKET_NAME = process.env.BUCKET_NAME

export const generatePresignedUrl = async (userId: string, fileType: string): Promise<string> => {
  const date = Date.now()
  const key = `profile-pictures/${userId}/${date.toString()}.${fileType}`
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 60 * 5, // URL valid for 5 minutes
    ContentType: `image/${fileType}`
  }

  return await s3.getSignedUrlPromise('putObject', params)
}
