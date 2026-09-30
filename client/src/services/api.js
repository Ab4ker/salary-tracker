// Базовый URL API из переменных окружения
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Универсальная функция для выполнения HTTP-запросов
 * @param {string} path - путь эндпоинта (например, '/incomes')
 * @param {Object} options - опции запроса (method, body, params)
 * @returns {Promise<any>} данные из ответа или пробрасывает ошибку
 */
async function request(path, options = {}) {
  // Формируем полный URL
  const url = new URL(`${BASE_URL}${path}`);

  // Добавляем query-параметры, если они есть
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  // Формируем заголовки
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    // Выполняем запрос
    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // Парсим JSON-ответ
    const data = await response.json();

    // Если HTTP-статус не успешный (4xx, 5xx) — пробрасываем ошибку
    if (!response.ok) {
      const errorMessage = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      const errorCode = data?.error?.code || 'HTTP_ERROR';
      const error = new Error(errorMessage);
      error.code = errorCode;
      error.status = response.status;
      throw error;
    }

    // Возвращаем данные из ответа
    // Если есть поле data — возвращаем его, иначе весь ответ
    return data.data !== undefined ? data.data : data;
  } catch (error) {
    // Обработка ошибок сети (нет соединения, таймаут и т.д.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Ошибка сети: не удалось подключиться к серверу');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    // Пробрасываем остальные ошибки
    throw error;
  }
}

/**
 * GET-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} params - query-параметры
 * @returns {Promise<any>} данные из ответа
 */
export function get(path, params = {}) {
  return request(path, { method: 'GET', params });
}

/**
 * POST-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function post(path, body) {
  return request(path, { method: 'POST', body });
}

/**
 * PUT-запрос
 * @param {string} path - путь эндпоинта
 * @param {Object} body - тело запроса
 * @returns {Promise<any>} данные из ответа
 */
export function put(path, body) {
  return request(path, { method: 'PUT', body });
}

/**
 * DELETE-запрос
 * @param {string} path - путь эндпоинта
 * @returns {Promise<any>} данные из ответа
 */
export function del(path) {
  return request(path, { method: 'DELETE' });
}

export default { get, post, put, del };