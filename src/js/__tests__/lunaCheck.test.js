import lunaCheck from '../lunaCheck.js';

describe('Luhn Algorithm', () => {
  test('валидный номер Visa', () => {
    expect(lunaCheck('4111111111111111')).toBe(true);
  });

  test('валидный номер MasterCard', () => {
    expect(lunaCheck('5555 5555 5555 4444')).toBe(true);
  });

  test('невалидный номер', () => {
    expect(lunaCheck('1234 5678 9012 3456')).toBe(false);
  });

  test('обрабатывает номера с дефисами', () => {
    expect(lunaCheck('4111-1111-1111-1111')).toBe(true);
  });
});
