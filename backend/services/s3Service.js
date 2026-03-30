const AWS = require('aws-sdk');

const {
  BUCKETEER_AWS_ACCESS_KEY_ID,
  BUCKETEER_AWS_SECRET_ACCESS_KEY,
  BUCKETEER_BUCKET_NAME,
} = process.env;

AWS.config.update({
  accessKeyId: BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

const uploadBufferToS3 = async (buffer, fileName) => {
  if (!buffer) {
    return null;
  }

  const params = {
    Bucket: BUCKETEER_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: buffer,
  };

  const { Location } = await s3.upload(params).promise();
  return Location;
};

module.exports = {
  uploadBufferToS3,
};
