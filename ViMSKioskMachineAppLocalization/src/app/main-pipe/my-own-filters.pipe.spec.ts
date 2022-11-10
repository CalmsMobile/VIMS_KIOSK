import { MyOwnFiltersPipe } from './my-own-filters.pipe';

describe('MyOwnFiltersPipe', () => {
  it('create an instance', () => {
    const pipe = new MyOwnFiltersPipe();
    expect(pipe).toBeTruthy();
  });
});
