const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { userPrisma } = require('../utils/prisma/index.js');

dotenv.config();

const router = express.Router();

/** 사용자 회원가입 API **/
router.post("/sign-up", async (req, res, next) => {
  try {
    const { accountId, password, name } = req.body;
    const isExistUser = await userPrisma.users.findFirst({
      where: { accountId },
    });
    if (isExistUser) {
      console.log(isExistUser.accountId);
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userPrisma.users.create({
      data: {
        accountId,
        password: hashedPassword,
        name,
      },
    });

    return res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", user });
  } catch (err) {
    next(err);
  }
});

/** 로그인 API **/
router.post('/sign-in', async (req, res, next) => {
  const { accountId, password } = req.body;
  const user = await userPrisma.users.findFirst({ where: { accountId } });

  if (!user)
    return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.SECRET_KEY
  );

  // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인 성공' });
});

exports.router = router;
