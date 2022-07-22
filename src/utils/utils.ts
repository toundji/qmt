/* eslint-disable prettier/prettier */

import { extname } from "path";
import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException("Seul les fichiers images sont autoriser!"), false);
  }
  callback(null, true);
};

export const imageOrPdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(new BadRequestException("Seul les fichiers images sont autoriser!"), false);
  }
  callback(null, true);
};

export const profileFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new BadRequestException("Seul les fichiers images sont autoriser!"), false);
    }
    callback(null, true);
  };
  export const pdfFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return callback(new BadRequestException("Seul les fichiers images sont autoriser!"), false);
    }
    callback(null, true);
  };

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Date.now();
    callback(null, `${name}-${randomName}${fileExtName}`);
  };
