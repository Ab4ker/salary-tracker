import { get, post, put, del } from './api';

/**
 * Получить все расходы
 * @param {Object} filters - параметры фильтрации
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - дата до (YYYY-MM-DD)
 * @param {boolean} filters.isRecurring - фильтр по признаку регулярности
 * @param {number} filters.page - номер страницы
 * @param {number} filters.limit - записей на странице
 * @returns {Promise<Array>} массив расходов
 */
export const getExpenses = async (filters = {}) => {
  try {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.isRecurring !== undefined) params.isRecurring = filters.isRecurring;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const data = await get('/expenses', params);
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.error('Ошибка получения расходов:', error);
    return [];
  }
};

/**
 * Получить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<Object|null>} объект расхода или null
 */
export const getExpenseById = async (id) => {
  if (!id) return null;

  try {
    const data = await get(`/expenses/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Ошибка получения расхода ${id}:`, error);
    return null;
  }
};

/**
 * Добавить новый расход
 * @param {Object} expenseData - данные расхода (category, amount, date, comment, isRecurring)
 * @returns {Promise<Object|null>} созданный расход или null
 */
export const addExpense = async (expenseData) => {
  if (!expenseData) {
    console.error('addExpense: данные не переданы');
    return null;
  }

  try {
    const data = await post('/expenses', {
      category: expenseData.category || 'other',
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      comment: expenseData.comment || '',
      isRecurring: Boolean(expenseData.isRecurring),
    });
    return data;
  } catch (error) {
    console.error('Ошибка добавления расхода:', error);
    return null;
  }
};

/**
 * Обновить существующий расход
 * @param {string} id - идентификатор расхода
 * @param {Object} expenseData - новые данные расхода
 * @returns {Promise<Object|null>} обновлённый расход или null
 */
export const updateExpense = async (id, expenseData) => {
  if (!id || !expenseData) {
    console.error('updateExpense: id или данные не переданы');
    return null;
  }

  try {
    const data = await put(`/expenses/${id}`, {
      category: expenseData.category,
      amount: expenseData.amount !== undefined ? Number(expenseData.amount) : undefined,
      date: expenseData.date,
      comment: expenseData.comment,
      isRecurring: expenseData.isRecurring !== undefined ? Boolean(expenseData.isRecurring) : undefined,
    });
    return data;
  } catch (error) {
    console.error(`Ошибка обновления расхода ${id}:`, error);
    return null;
  }
};

/**
 * Удалить расход по ID
 * @param {string} id - идентификатор расхода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export const deleteExpense = async (id) => {
  if (!id) {
    console.error('deleteExpense: id не передан');
    return false;
  }

  try {
    await del(`/expenses/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления расхода ${id}:`, error);
    return false;
  }
};