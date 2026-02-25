// взаимодействиe с DOM
import lunaCheck from './lunaCheck.js';
import cardTypeCheck from './cardTypeCheck.js';
import amex from './icons/amex.png';
import diners from './icons/diners.png';
import discover from './icons/discover.png';
import jcb from './icons/jcb.png';
import mastercard from './icons/mastercard.png';
import mir from './icons/mir.png';
import visa from './icons/visa.png';

export default function CreditCardWidget(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  // Очищаем контейнер
  container.innerHTML = '';

  // Создаем основной виджет
  const widget = document.createElement('div');
  widget.className = 'credit-card-widget';

  // Создаем контейнер для иконок
  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'card-icons';

  // Массив с данными для иконок
  const cardTypes = [
    { type: 'amex', src: amex, alt: 'Amex' },
    { type: 'diners', src: diners, alt: 'Diners' },
    { type: 'discover', src: discover, alt: 'Discover' },
    { type: 'jcb', src: jcb, alt: 'JCB' },
    { type: 'mastercard', src: mastercard, alt: 'Mastercard' },
    { type: 'mir', src: mir, alt: 'Мир' },
    { type: 'visa', src: visa, alt: 'Visa' },
  ];

  // Создаем иконки через createElement
  cardTypes.forEach((card) => {
    const img = document.createElement('img');
    img.src = card.src;
    img.alt = card.alt;
    img.className = 'card-icon';
    img.dataset.type = card.type;
    iconsContainer.appendChild(img);
  });

  // Создаем input группу
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'card-input';
  input.placeholder = '0000 0000 0000 0000';
  input.maxLength = 23;
  input.id = 'card-number-input';

  const button = document.createElement('button');
  button.className = 'validate-button';
  button.id = 'validate-btn';
  button.textContent = 'Click to Validate';

  inputGroup.appendChild(input);
  inputGroup.appendChild(button);

  // Создаем сообщение валидации
  const validationMessage = document.createElement('div');
  validationMessage.className = 'validation-message';
  validationMessage.id = 'validation-message';

  // Собираем виджет
  widget.appendChild(iconsContainer);
  widget.appendChild(inputGroup);
  widget.appendChild(validationMessage);
  container.appendChild(widget);

  const icons = document.querySelectorAll('.card-icon');
  const validateBtn = document.getElementById('validate-btn');
  const messageEl = document.getElementById('validation-message');

  // Объект с правилами для разных типов карт
  const cardRules = {
    amex: {
      lengths: [15], // Длина номера: 15 цифр
      format: (value) => {
        // Формат отображения: 4-6-5 - разбивает строку на три части и собирает их в массив
        const parts = [
          value.slice(0, 4), // символы с 0 по 3 (4 символа)
          value.slice(4, 10),
          value.slice(10, 15),
        ];
        // 2. Убираем пустые части и соединяем пробелами
        return parts.filter((part) => part.length > 0).join(' ');
      },
    },
    visa: {
      lengths: [13, 16, 19],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
    mastercard: {
      lengths: [16],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
    mir: {
      lengths: [16, 18, 19],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
    discover: {
      lengths: [16, 19],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
    diners: {
      lengths: [14, 16, 19],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
    jcb: {
      lengths: [16, 19],
      format: (value) => value.match(/.{1,4}/g)?.join(' ') || value,
    },
  };

  function updateCardType(rawValue) {
    // Определяем платежную систему
    const cardType = cardTypeCheck(rawValue);

    // Подсвечиваем соответствующую иконку
    icons.forEach((icon) => {
      icon.classList.remove('active');
      if (icon.dataset.type === cardType) {
        icon.classList.add('active');
      }
    });

    return cardType;
  }

  function formatCardNumber(value, cardType) {
    const rawValue = value.replace(/\s/g, '');

    // Если тип карты определён и для него есть специальное форматирование
    if (cardType && cardRules[cardType]) {
      return cardRules[cardType].format(rawValue);
    }

    // По умолчанию: группировка по 4 цифры
    if (rawValue.length > 0) {
      return rawValue.match(/.{1,4}/g)?.join(' ') || rawValue;
    }
    return rawValue;
  }

  function isValidLength(rawValue, cardType) {
    if (!cardType || !cardRules[cardType]) {
      // Если тип не определён, проверяем по минимальной длине
      return rawValue.length >= 13 && rawValue.length <= 19;
    }

    // Проверяем, входит ли длина в допустимые для этого типа карты
    return cardRules[cardType].lengths.includes(rawValue.length);
  }

  // Функция для валидации по кнопке и Enter
  function validateCard() {
    const rawValue = input.value.replace(/\s/g, '');

    // Проверка на пустой ввод
    if (rawValue.length === 0) {
      messageEl.textContent = 'Введите номер карты';
      messageEl.className = 'validation-message error';
      return;
    }

    const cardType = updateCardType(rawValue);

    // Проверка длины в зависимости от типа карты
    if (!isValidLength(rawValue, cardType)) {
      let expectedLength = '13-19 цифр';
      if (cardType && cardRules[cardType]) {
        expectedLength = cardRules[cardType].lengths.join(' или ');
      }

      messageEl.textContent = `✗ Для карт ${cardType || 'этого типа'} допустимая длина: ${expectedLength}`;
      messageEl.className = 'validation-message invalid';

      // Всё равно проверяем по Луну, может номер просто длинный, но валидный
      if (lunaCheck(rawValue)) {
        messageEl.textContent += ' (но номер прошёл проверку Луна)';
      }
      return;
    }

    // Валидация при достаточной длине
    if (lunaCheck(rawValue)) {
      messageEl.textContent = '✓ Номер корректен';
      messageEl.className = 'validation-message valid';
    } else {
      messageEl.textContent = '✗ Неверный номер карты';
      messageEl.className = 'validation-message invalid';
    }
  }
  // форматирование при вводе цифр - удаляем пробелы и обн иконку
  input.addEventListener('input', (e) => {
    let rawValue = e.target.value.replace(/\s/g, '');

    // Убираем всё, кроме цифр
    rawValue = rawValue.replace(/\D/g, '');

    // Ограничиваем длину чтобы длинное значение не ввели
    if (rawValue.length > 19) {
      messageEl.textContent = '⚠ Номер длиннее обычного, проверьте правильность ввода';
      messageEl.className = 'validation-message warning';
    }

    const cardType = cardTypeCheck(rawValue);// Определяем тип карты для форматирования

    // Форматируем номер в зависимости от типа
    const displayValue = formatCardNumber(rawValue, cardType);

    // Обновляем поле ввода
    e.target.value = displayValue;

    updateCardType(rawValue);

    // Очищаем сообщение валидации при вводе нового номера
    if (rawValue.length === 0) {
      messageEl.textContent = '';
      messageEl.className = 'validation-message';
    }
  });

  // Валидация по клику на кнопку
  validateBtn.addEventListener('click', validateCard);

  // Валидация по Enter в поле ввода
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCard();
    }
  });
}
