import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getDb } from '../lib/mongodb';

// Ensure .env is loaded
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

export interface UploadImageResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadCoverImage(
  localFilePath: string,
  altText: string = 'Demoly Blog Cover'
): Promise<UploadImageResult | null> {
  if (!fs.existsSync(localFilePath)) {
    console.warn(`[CLOUDINARY] Image file not found: ${localFilePath}`);
    return null;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(`[CLOUDINARY] Cloudinary credentials missing in .env. Skipping cloud upload.`);
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    const folder = process.env.CLOUDINARY_FOLDER || 'demoly-cms';
    console.log(`[CLOUDINARY] Uploading ${path.basename(localFilePath)} to Cloudinary folder '${folder}'...`);

    const uploadRes = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'image',
    });

    // Also register in Demoly CMS media collection so it appears in Media Library
    try {
      const db = await getDb();
      const now = new Date();
      await db.collection('media').insertOne({
        filename: path.basename(localFilePath),
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        altText,
        width: uploadRes.width,
        height: uploadRes.height,
        fileSize: uploadRes.bytes,
        mimeType: `image/${uploadRes.format || 'webp'}`,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`[CLOUDINARY] Image successfully registered in CMS media collection.`);
    } catch (mediaDbErr) {
      console.warn(`[CLOUDINARY] Could not register in media collection:`, mediaDbErr);
    }

    return {
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height,
      format: uploadRes.format,
      bytes: uploadRes.bytes,
    };
  } catch (err) {
    console.error(`[CLOUDINARY] Upload failed:`, err);
    return null;
  }
}
