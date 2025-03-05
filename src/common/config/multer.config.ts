import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export const multerConfig: MulterOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Default uploads directory
      let uploadFolder = path.join(__dirname, '../../uploads');

      // Determine specific subfolder based on route or field name
      if (
        req.baseUrl.includes('image') ||
        (req.route && req.route.path && req.route.path.includes('image'))
      ) {
        switch (file.fieldname) {
          case 'image':
            uploadFolder = path.join(uploadFolder, 'users_image');
            break;
          default:
            uploadFolder = path.join(uploadFolder, 'others');
            break;
        }
      }

      // Create the directory if it doesn't exist
      fs.mkdir(uploadFolder, { recursive: true }, (err) => {
        if (err) {
          cb(err, uploadFolder);
        } else {
          cb(null, uploadFolder);
        }
      });
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
};
