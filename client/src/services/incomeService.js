import { get, post, put, del } from './api';

/**
 * Получить все доходы
 * @param {Object} filters - параметры фильтрации
 * @param {string} filters.category - фильтр по категории
 * @param {string} filters.dateFrom - дата от (YYYY-MM-DD)
 * @param {string} filters.dateTo - дата до (YYYY-MM-DD)
 * @param {number} filters.page - номер страницы
 * @param {number} filters.limit - записей на странице
 * @returns {Promise<Array>} массив доходов
 */
export const getIncomes = async (filters = {}) => {
  try {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const data = await get('/incomes', params);
    // api.js возвращает поле data (массив), если оно есть в ответе
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.error('Ошибка получения доходов:', error);
    return [];
  }
};

/**
 * Получить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<Object|null>} объект дохода или null
 */
export const getIncomeById = async (id) => {
  if (!id) return null;

  try {
    const data = await get(`/incomes/${id}`);
    return data || null;
  } catch (error) {
    console.error(`Ошибка получения дохода ${id}:`, error);
    return null;
  }
};

/**
 * Добавить новый доход
 * @param {Object} incomeData - данные дохода (category, amount, date, comment)
 * @returns {Promise<Object|null>} созданный доход или null
 */
export const addIncome = async (incomeData) => {
  if (!incomeData) {
    console.error('addIncome: данные не переданы');
    return null;
  }

  try {
    const data = await post('/incomes', {
      category: incomeData.category || 'other',
      amount: Number(incomeData.amount) || 0,
      date: incomeData.date || new Date().toISOString().split('T')[0],
      comment: incomeData.comment || '',
    });
    return data;
  } catch (error) {
    console.error('Ошибка добавления дохода:', error);
    return null;
  }
};

/**
 * Обновить существующий доход
 * @param {string} id - идентификатор дохода
 * @param {Object} incomeData - новые данные дохода
 * @returns {Promise<Object|null>} обновлённый доход или null
 */
export const updateIncome = async (id, incomeData) => {
  if (!id || !incomeData) {
    console.error('updateIncome: id или данные не переданы');
    return null;
  }

  try {
    const data = await put(`/incomes/${id}`, {
      category: incomeData.category,
      amount: incomeData.amount !== undefined ? Number(incomeData.amount) : undefined,
      date: incomeData.date,
      comment: incomeData.comment,
    });
    return data;
  } catch (error) {
    console.error(`Ошибка обновления дохода ${id}:`, error);
    return null;
  }
};

/**
 * Удалить доход по ID
 * @param {string} id - идентификатор дохода
 * @returns {Promise<boolean>} true, если удаление успешно
 */
export const deleteIncome = async (id) => {
  if (!id) {
    console.error('deleteIncome: id не передан');
    return false;
  }

  try {
    await del(`/incomes/${id}`);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления дохода ${id}:`, error);
    return false;
  }
};