import { UrlPipe } from './url.pipe';
import {environment} from "../../../environments/environment";

describe('UrlPipe', () => {
  it('create an instance', () => {
    let image = 'image.png';
    const pipe = new UrlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(image)).toEqual(`${environment.configUrl}/${image}`);
  });
});
