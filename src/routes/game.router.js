import express from 'express';
import { gameDataClient } from '../utils/prisma/index.js';

const router = express.Router();

/** 아이템 생성 API */
router.post('/item', async (req, res, next) => {
  const { item_code, item_name, item_stat, item_price } = req.body;

  try {
    const newItem = await gameDataClient.item.create({
      data: {
        item_code,
        item_name,
        health: item_stat.health,
        power: item_stat.power,
        item_price,
      },
    });

    return res.status(201).json({ id: newItem.id });
  } catch (error) {
    console.error('Error retrieving items', error);
    res
      .status(500)
      .json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

/** 아이템 수정 API */
router.put('/item/:id', async (req, res, next) => {
  const itemId = +req.params.id;
  const { item_name, item_stat } = req.body;

  try {
    const existingItem = await gameDataClient.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res
        .status(404)
        .json({ messgae: '해당 아이템을 찾을 수 없습니다.' });
    }

    const updatedItem = await gameDataClient.item.update({
      where: { id: itemId },
      data: {
        item_name,
        health: item_stat.health,
        power: item_stat.power,
      },
    });

    res
      .status(200)
      .json({ message: '아이템이 성공적으로 수정되었습니다.', updatedItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

/** 아이템 목록 조회 API */
router.get('/items', async (req, res, next) => {
  try {
    const items = await gameDataClient.item.findMany({
      select: {
        item_code: true,
        item_name: true,
        item_price: true,
      },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error retrieving items', error);
    res
      .status(500)
      .json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

/** 아이템 상세 조회 API */
router.get('/item/:itemCode', async (req, res, next) => {
  const itemCode = +req.params.itemCode;

  try {
    const item = await gameDataClient.item.findUnique({
      where: { item_code: itemCode },
      select: {
        item_code: true,
        item_name: true,
        health: true,
        power: true,
        item_price: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: '아이템을 찾을 수 없습니다.' });
    }

    const itemWithStats = {
      item_code: item.item_code,
      item_name: item.item_name,
      item_stat: { health: item.health, power: item.power },
      item_price: item.item_price,
    };

    res.status(200).json(itemWithStats);
  } catch (error) {
    console.error('Error retrieving items', error);
    res
      .status(500)
      .json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

export default router;
