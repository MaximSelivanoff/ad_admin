# Используем легкий образ Node.js
FROM node:20-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только файлы зависимостей (для кэширования)
COPY backend/package*.json ./

# Устанавливаем зависимости
RUN npm install --omit=dev

# Копируем остальной код проекта
COPY backend/ ./

# Открываем порт (тот, что в коде, обычно 5000)
EXPOSE 5000

# Запуск миграций и приложения
CMD ["sh", "-c", "node migrate.js && node src/index.js"]
