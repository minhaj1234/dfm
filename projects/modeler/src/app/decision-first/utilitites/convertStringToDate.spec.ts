import { convertStringToDate  } from './convertStringToDate';

describe('convertStringToDate', () => {
  it('should return date if string is not empty', () => {
    const date =  new Date('2020-02-06 01:00:00.0'); 
    const expected = date;
    
    const result = convertStringToDate(date.toString());

    expect(result).toEqual(expected);
  });

  it('should return null if string is empty', () => {
    const result = convertStringToDate('');

    expect(result).toEqual(null);
  });
});
