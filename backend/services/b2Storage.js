const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');

/**
 * Backblaze B2 Storage Service
 * Handles file uploads and deletions to Backblaze B2 cloud storage
 */

// Initialize S3 client for Backblaze B2
const s3Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: process.env.B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

/**
 * Upload a file to Backblaze B2
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Folder path in bucket (default: 'movies')
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadToB2 = async (fileBuffer, fileName, mimeType, folder = 'movies') => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    const uniqueFileName = `${folder}/${timestamp}-${sanitizedName}${ext}`;

    // Upload parameters
    const uploadParams = {
      Bucket: process.env.B2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    // Use Upload for better handling of large files
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    // Execute upload
    await upload.done();

    // Construct public URL
    // Format: https://bucketname.s3.endpoint/filename
    const bucketName = process.env.B2_BUCKET_NAME;
    const endpoint = process.env.B2_ENDPOINT;
    const publicUrl = `https://${bucketName}.${endpoint}/${uniqueFileName}`;

    return publicUrl;
  } catch (error) {
    console.error('B2 Upload Error:', error);
    throw new Error(`Failed to upload file to B2: ${error.message}`);
  }
};

/**
 * Delete a file from Backblaze B2
 * @param {string} fileUrl - The public URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteFromB2 = async (fileUrl) => {
  try {
    // Extract the file key from the URL
    // URL format: https://bucketname.s3.endpoint/folder/filename
    const bucketName = process.env.B2_BUCKET_NAME;
    const endpoint = process.env.B2_ENDPOINT;
    const urlPrefix = `https://${bucketName}.${endpoint}/`;
    
    if (!fileUrl.startsWith(urlPrefix)) {
      console.warn('File URL does not match B2 bucket URL format, skipping deletion');
      return false;
    }

    const fileKey = fileUrl.replace(urlPrefix, '');

    // Delete parameters
    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    // Execute delete
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    console.log(`Successfully deleted file from B2: ${fileKey}`);
    return true;
  } catch (error) {
    console.error('B2 Delete Error:', error);
    // Don't throw error for delete failures, just log them
    return false;
  }
};

/**
 * Upload multiple files to Backblaze B2
 * @param {Array} files - Array of file objects with buffer, originalname, and mimetype
 * @param {string} folder - Folder path in bucket (default: 'movies')
 * @returns {Promise<Array<string>>} - Array of public URLs
 */
const uploadMultipleToB2 = async (files, folder = 'movies') => {
  try {
    const uploadPromises = files.map(file => 
      uploadToB2(file.buffer, file.originalname, file.mimetype, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('B2 Multiple Upload Error:', error);
    throw new Error(`Failed to upload multiple files to B2: ${error.message}`);
  }
};

module.exports = {
  uploadToB2,
  deleteFromB2,
  uploadMultipleToB2,
};
