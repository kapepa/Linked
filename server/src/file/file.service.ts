import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { diskStorage } from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import {from, Observable, of, switchMap} from "rxjs";
import {FileTypeResult, fromFile} from 'file-type';
import {join} from "path";
import * as fs from "fs";

export const multerOption = {
  storage: diskStorage({
    destination: './static',
    filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
      const fileExtension: string = file.originalname.split('.').pop();
      const fileName: string = `${uuidv4() + fileExtension}.${fileExtension}`;
      callback(null, fileName)
    }
  }),
  fileFilter: (req, file, cb) => {
    if(!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.mimetype)){
      return cb(new HttpException('Extensions file is not correct', HttpStatus.FORBIDDEN));
    }
    cb(null, true);
  },
  limits: {
    fieldNameSize: 300,
    fileSize: 10000
  }
}

@Injectable()
export class FileService {

  formFile( filePath:string ): Observable<boolean> {
    const existPath = join(__dirname, '..', '..', 'static', filePath)
    return from(fromFile(existPath)).pipe(
      switchMap((fileType: FileTypeResult) => {
        if(!fileType) of(false)
        return of(!!fileType)
      })
    );
  }

  async removeFile( filePath:string ): Promise<boolean> {
    try {
      const existPath = join(__dirname, '..', '..', 'static', filePath);
      await fs.unlinkSync(existPath);
      return true;
    } catch (err) {
      throw new HttpException('I made a mistake while deleting', HttpStatus.BAD_REQUEST);
    }
  }
}
