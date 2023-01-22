import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import * as fs from "fs";
import {join, resolve} from "path";
import DoneCallback = jest.DoneCallback;
import {catchError} from "rxjs";
import {HttpException, HttpStatus} from "@nestjs/common";

describe('FileService', () => {
  let service: FileService;

  let mockImage = resolve(__dirname, '..', '..', 'static', 'face-14.jpg');

  let mockFile = {
    fieldname: 'file',
    originalname: 'face-14.jpg',
    encoding: '7bit',
    mimetype: 'image/jpg',
    buffer: Buffer.from('<Buffer ff d8 ff e0 00 10 4a 46 49 42>'),
    size: 51828,
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    jest.restoreAllMocks();
    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sharpFile()', () => {
    it('resize loaded images, sharpFile()', () => {
      service.sharpFile(mockImage).subscribe((bol: boolean) => {
        expect(jest.spyOn(fs, 'writeFile')).not.toHaveBeenCalled()
        expect(bol).toBeTruthy();
      })
    })
  })

  describe('formFile()', () => {
    let avatar = 'face-14.jpg';

    it('check exist file, return boole value', (done) => {
      service.formFile(avatar).subscribe((bol: boolean) => {
        expect(bol).toBeTruthy();
        done();
      })
    })

    it('Such file not exist', (done) => {
      service.formFile('').subscribe({
        error: (err) => {
          expect(err.response).toEqual('Such file not exist');
          done();
        }
      })
    })
  })


  describe('removeFile', () => {
    let avatar = 'face-14.jpg';
    it('success remove file',  async () => {
      jest.spyOn(fs, 'unlinkSync').mockImplementationOnce(() => {});

      expect(await service.removeFile(avatar)).toBeTruthy();
      expect(fs.unlinkSync).toHaveBeenCalledWith(join(__dirname, '..', '..', 'static', avatar));
    })

    it('I made a mistake while deleting', async () => {
      jest.spyOn(fs, 'unlinkSync').mockImplementationOnce(() => Promise.reject(new Error('Err')));
      try {
        await service.removeFile(avatar)
      } catch (err) {
        expect(err.response).toEqual('I made a mistake while deleting');
      }
    })
  })

});
