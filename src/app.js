const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const ErrorHandlingMiddleware = require('./middlewares/error-handling.middleware.js');
const { router:UsersRouter } = require('./routes/users.router.js');
const { router:CharactersRouter } = require('./routes/characters.router.js');
const { router:ItemsRouter } = require('./routes/items.router.js');

// .env 파일을 읽어서 process.env에 추가합니다.
dotenv.config();

const app = express();
const PORT = process.env.DATABASE_PORT;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [UsersRouter, CharactersRouter, ItemsRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
