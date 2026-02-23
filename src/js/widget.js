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

  container.innerHTML = `
    <div class="credit-card-widget">
      <div class="card-icons">
        <img src="${amex}" alt="Visa" class="card-icon" data-type="amex">
        <img src="${diners}" alt="MasterCard" class="card-icon" data-type="diners">
        <img src="${discover}" alt="Мир" class="card-icon" data-type="discover">
        <img src="${jcb}" alt="Amex" class="card-icon" data-type="jcb">
        <img src="${mastercard}" alt="Discover" class="card-icon" data-type="mastercard">
        <img src="${mir}" alt="JCB" class="card-icon" data-type="mir">
        <img src="${visa}" alt="Diners" class="card-icon" data-type="visa">
      </div>
      <div class="input-group">
      <input type="text" 
             class="card-input" 
             placeholder="0000 0000 0000 0000"
             maxlength="19"
             id="card-number-input">
    <button class="validate-button" id="validate-btn">Click to Validate</button>
    </div>   
    <div class="validation-message" id="validation-message"></div>
    </div>    
    `;

  const input = document.getElementById('card-number-input');
  const icons = document.querySelectorAll('.card-icon');
  const button = document.getElementById('validate-btn');
  const validationMessage = document.getElementById('validation-message');

  function updateCardType() {
    const rawValue = input.value.replace(/\s/g, '');

    // Определяем платежную систему
    const cardType = cardTypeCheck(rawValue);

    // Подсвечиваем соответствующую иконку
    icons.forEach((icon) => {
      icon.classList.remove('active');
      if (icon.dataset.type === cardType) {
        icon.classList.add('active');
      }
    });
  }

  // Функция для валидации по кнопке и Enter
  function validateCard() {
    const rawValue = input.value.replace(/\s/g, '');

    // Валидация при достаточной длине
    if (rawValue.length >= 13) { // Минимальная длина карты у визы
      if (lunaCheck(rawValue)) {
        validationMessage.textContent = '✓ Номер корректен';
        validationMessage.className = 'validation-message valid';
      } else {
        validationMessage.textContent = '✗ Неверный номер карты';
        validationMessage.className = 'validation-message invalid';
      }
    } else {
      validationMessage.textContent = '';
    }

    updateCardType();// Также обновляем иконку при валидации
  }

  // форматирование при вводе цифр - удаляем пробелы и обн иконку
  input.addEventListener('input', (e) => {
    let rawValue = e.target.value.replace(/\s/g, '');

    // Ограничиваем длину чтобы длинное значение не ввели
    if (rawValue.length > 16) {
      rawValue = rawValue.slice(0, 16);
    }

    const cardType = cardTypeCheck(rawValue);

    // Подсвечиваем соответствующую иконку
    icons.forEach((icon) => {
      icon.classList.remove('active');
      if (icon.dataset.type === cardType) {
        icon.classList.add('active');
      }
    });

    // Добавляем пробелы после каждых 4 цифр для красоты и корректности
    //  внешнего вида для оценки пользователя
    let displayValue = rawValue;
    if (rawValue.length > 0) {
      displayValue = rawValue.match(/.{1,4}/g).join(' ');
    }

    e.target.rawValue = displayValue;

    // Очищаем сообщение валидации при вводе нового номера
    validationMessage.textContent = '';
    validationMessage.className = 'validation-message';
  });

  // Валидация по клику на кнопку
  button.addEventListener('click', validateCard);

  // Валидация по Enter в поле ввода
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      validateCard();
    }
  });
}
