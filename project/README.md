# Автотесты для API вебсервиса распознавания языка текста
Проект создан в рамках обучения на курсе Javascript QA от OTUS.

# Описание проекта
Автоматизированы основные проверки API сайта detectlanguage.com. Для авторизации использован Playwright, тестирование API выполняется с помощью Axios, проверка результатов и создание отчётов с помощью Jest. 

# Запуск тестов
Для запуска тестов необходимо создать переменную окружения по следующему шаблону:

*export detectLNG='{"url":"site_url","urlapi":"site_url_for_api_requests","token":"your_token_here","email":"your_email","password":"your_password"}'*

____
Установить зависимости и запустить тесты:
```
sudo apt-get update
sudo apt install curl -y 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
nvm install 14 
npm install -g npm
cd /'path to folder with package.json'
npm install
npm ci 
npm i check-depends
npm run test
```

