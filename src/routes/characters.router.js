const express = require('express');
const { userPrisma } = require('../utils/prisma/index.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const router = express.Router();

/** 캐릭터 생성 API **/
router.post('/characters', authMiddleware, async (req, res, next) => {
  const { accessToken } = req.cookies;
    if(!accessToken){
      return res.status(400).json({ message : '로그인이 되어 있지 않습니다.'});
    }

    const payload = validateToken(accessToken, SECRET_KEY);
    if(!payload){
      return res.status(401).json({ message : '로그인에 문제가 생겼습니다.'})
    }
  const { userId } = req.user;
  const { characterName } = req.body;
  const isExistCharacter = await userPrisma.users.findFirst({
    where: {
      characterName,
    },
  });
  if (isExistCharacter) {
    return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
  }

  const characterId = prevCharacter ? prevCharacter.characterId + 1 : 1;

  const character = await userPrisma.characters.create({
    data: {
      UserId: +userId,
      characterId,
      characterName,
      health: 500,
      power: 100,
      money: 10000,
    },
  });

  return res.status(201).json({ data: character });
});

/** 캐릭터 삭제 API **/
router.delete(
  '/characters/:characterId',
  authMiddleware,
  async (req, res, next) => {
    const { accessToken } = req.cookies;
    if(!accessToken){
      return res.status(400).json({ message : '로그인이 되어 있지 않습니다.'});
    }

    const payload = validateToken(accessToken, SECRET_KEY);
    if(!payload){
      return res.status(401).json({ message : '로그인에 문제가 생겼습니다.'})
    }

    const user = req.user;
    const characterId = +req.params.characterId;

    const character = await userPrisma.characters.findFirst({
      where: { characterId },
    });

    if (!character) {
      return res.status(401).json({ message: '존재하지 않는 캐릭터입니다.' });
    }

    if (character.UserId !== user.userId) {
      return res.status(404).json({ message: '다른 사용자의 캐릭터입니다.' });
    }

    await userPrisma.characters.delete({
      where: { characterId },
    });

    return res.status(200).json({
      message: `캐릭터 '${character.characterName}'을 삭제하였습니다`,
    });
  }
);

/** 캐릭터 상세 조회 API */
router.get(
  '/characters/:characterId',
  authMiddleware,
  async (req, res, next) => {
    const user = req.user;
    const characterId = +req.params.characterId;

    const character = await userPrisma.characters.findFirst({
      where: { characterId },
    });

    if (!character) {
      return res.status(401).json({ message: '존재하지 않는 캐릭터입니다.' });
    }

    if (character.UserId !== user.userId) {
      const { characterName, health, power } = character;
      return res.status(200).json({ characterName, health, power });
    } else {
      const { characterName, health, power, money } = character;
      return res.status(200).json({ characterName, health, power, money });
    }
  }
);

// Token 검증, Payload 조회
function validateToken(token, secretKey) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

exports.router = router;
