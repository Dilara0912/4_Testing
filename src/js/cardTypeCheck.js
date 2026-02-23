// выяснениe принадлежности определённой платёжной системе
export default function cardTypeCheck(cardNumber) {
  const number = cardNumber.replace(/[\s-]/g, '');

  if (!number) return 'unknown';

  if (/^2/.test(number)) return 'mir';// мир начинается с 2

  if (/^3[47]/.test(number)) return 'amex';// Starts With 34, 37

  if (/^35/.test(number)) return 'jcb';// Starts With 35

  if (/^4/.test(number)) return 'visa';// Starts With 4

  if (/^5[1-5]/.test(number) || /^2(2[2-9][1-9]|2[3-9]|[3-6]|7[0-1]|720)/.test(number)) return 'mastercard';
  // Starts With 51, 52, 53, 54, 55, 222100-272099

  if (/^6011|^65|^64[4-9]|^622(1[2-9]|[2-8][0-9]|9[0-2][0-5])/.test(number)) return 'discover';
  // Starts With 6011, 622126 to 622925, 644, 645, 646, 647, 648, 649, 65

  if (/^36/.test(number)) return 'diners';// Starts With 36

  return 'unknown';
}
