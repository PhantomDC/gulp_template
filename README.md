# gulp_template
PENA gulp_template

Таски:
---
  <h3>gulp</h3>  - запустить сервер и начать отслеживание файлов
<hr>
<h3>gulp build</h3> - минифицировать .css, .js все картинки и сохранить в директории dist
<hr>
<h3>gulp deploy</h3> - залить на удаленный сервер файлы в папке dist. Доступы к серверу хранятся в объекте conf в файле gulpfile.js. Перед деплоем использует таск build.
<hr>
<h3>gulp backup</h3> - создает .zip архив из директории ./dist и сохраняет в корень проекта
<br>
<br>
<br>
<p>Остальные таски используются вышеперечисленными, их можно посмотреть в файле gulpfile.js</p>
