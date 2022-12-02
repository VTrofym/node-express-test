//Вначале подключены все сторонние пакеты
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//мы подключаем роуты
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

//создается экземпляр приложения
const app = express();

//  подключаем шаблоны
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//блок подключения промежуточного ПО
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //устанавливаем обработку статических ресурсов

//подключение роутеров в приложение
app.use("/", indexRouter);
app.use("/users", usersRouter);

// порядок подключаемого промежуточного ПО имеет значение.
//В конце приложения идет обработка ошибок.
//Вначале происходит обработка несуществующего роута или ошибка 404
app.use(function (req, res, next) {
  next(createError(404));
});

// отсутствие обработчика на запрашиваемый у сервера роутер это не ошибка
//мы создаем ошибку и пробрасываем ее дальше для обработки.
//Здесь и происходит обработка ошибки.
//Мы пробрасываем переменные message и error в шаблон error.ejs и выполняем его рендер
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
