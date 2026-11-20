import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTFOLIO_CASES } from '../data/agencyData';
import {
  buildWhatsAppMessageUrl,
  filterPortfolioCases,
  normalizePhoneDigits,
  validateQuickContact,
} from './diagnostic';

test('filterPortfolioCases returns all 4 illustrative cases on Todos', () => {
  const result = filterPortfolioCases(PORTFOLIO_CASES, 'Todos');
  assert.equal(result.length, 4);
});

test('filterPortfolioCases filters accurately by category', () => {
  const pizza = filterPortfolioCases(PORTFOLIO_CASES, 'Pizzaria');
  assert.equal(pizza.length, 1);
  assert.equal(pizza[0].clientName, 'Recanto da Pizza');

  const restaurant = filterPortfolioCases(PORTFOLIO_CASES, 'Restaurante');
  assert.equal(restaurant.length, 1);
  assert.equal(restaurant[0].clientName, 'Bella Dona');

  const gastronomy = filterPortfolioCases(PORTFOLIO_CASES, 'Gastronomia');
  assert.equal(gastronomy.length, 1);
  assert.equal(gastronomy[0].clientName, 'Bella Maria');

  const japanese = filterPortfolioCases(
    PORTFOLIO_CASES,
    'Culinária japonesa'
  );
  assert.equal(japanese.length, 1);
  assert.equal(japanese[0].clientName, 'Capitão Sushi');
});

test('validateQuickContact rejects invalid fields with clear messages', () => {
  const errors = validateQuickContact({
    name: '',
    businessName: 'A',
    segment: 'Pizzaria',
    phone: '123',
  });

  assert.ok(errors.name);
  assert.ok(errors.businessName);
  assert.ok(errors.phone);
});

test('validateQuickContact passes for valid contact and builds WhatsApp URL', () => {
  const input = {
    name: 'Mariana Costa',
    businessName: 'Recanto da Pizza',
    segment: 'Pizzaria' as const,
    phone: '(11) 91788-2507',
  };

  assert.deepEqual(validateQuickContact(input), {});
  assert.equal(normalizePhoneDigits(input.phone), '11917882507');

  const url = buildWhatsAppMessageUrl(input);
  assert.ok(url.startsWith('https://wa.me/5511917882507?text='));
  assert.ok(url.includes(encodeURIComponent('Recanto da Pizza')));
});
