import cardTypeCheck from '../cardTypeCheck.js';

describe('Card Type Detection', () => {
  test('определяет Мир', () => {
    expect(cardTypeCheck('2200 1234 5678 9012')).toBe('mir');
  });

  test('определяет Visa', () => {
    expect(cardTypeCheck('4532 1234 5678 9012')).toBe('visa');
  });

  test('определяет MasterCard', () => {
    expect(cardTypeCheck('5555 5555 5555 4444')).toBe('mastercard');
  });

  test('определяет American Express', () => {
    expect(cardTypeCheck('3782 822463 10005')).toBe('amex');
  });

  test('возвращает unknown для неизвестной системы', () => {
    expect(cardTypeCheck('9999 9999 9999 9999')).toBe('unknown');
  });
});
