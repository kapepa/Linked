import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import * as fs from "fs";
import * as sharp from "sharp";
import {join, resolve} from "path";
import {of} from "rxjs";

describe('FileService', () => {
  let service: FileService;

  let mockPictureName: string = '1b7246c0-d896-43ad-80d2-7435cbcc614bpng.png';
  let mockImage = resolve(__dirname, '..', '..', 'static', mockPictureName);

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
    const writeFileSpy = jest.spyOn(fs, "writeFile");

    it('resize loaded images, sharpFile()', () => {
      service.sharpFile(mockImage).subscribe((bol: boolean) => {
        expect(jest.spyOn(fs, 'writeFile')).not.toHaveBeenCalled()
        expect(bol).toBeTruthy();
      })
    })
  })

  describe('formFile()', () => {
    it('check exist file, return boole value', (done) => {
      jest.spyOn(service, 'formFile').mockReturnValue(of(true));

      service.formFile(mockPictureName).subscribe((bol: boolean) => {
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
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => Promise.reject(new Error('Err')));
      try {
        await service.removeFile(avatar)
      } catch (err) {
        expect(err).toBeTruthy()
      }
    })
  })

});
