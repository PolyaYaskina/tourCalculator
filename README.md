# 🧭 YG Tour Builder

Конструктор туров для Yaskin Group: визуальное планирование, выбор услуг, расчёт сметы с НДС и генерация Markdown/Excel.

---

## 🚀 Быстрый старт

### Backend
Используйте виртуальное окружение Python и установите зависимости перед запуском сервера API.

```bash
cd yg_tour_builder/backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../../requirements.txt
uvicorn main:app --reload
```

### Frontend
Установите зависимости Node.js и запустите сервер разработки.

```bash
cd yg_tour_builder/frontend
npm install
npm run dev
```
