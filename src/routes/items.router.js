const express = require('express');
const { itemPrisma, userPrisma } = require("../utils/prisma/index.js");

const router = express.Router();

/** 아이템 생성 API */
router.post('/items', async (req, res, next) => {
    const { itemName } = req.body;
    const isExistItem = await itemPrisma.items.findFirst({
      where: {
        itemName,
      },
    });
    if (isExistItem) {
      return res.status(409).json({ message: '이미 존재하는 아이템입니다.' });
    }
  
    const item = await itemPrisma.items.create({
      data: {
        itemName,
        itemCode,
        itemStat,
        itemPrice,
      },
    });
  
    return res.status(201).json({ data: item });
  });


/** 아이템 수정 API */
router.put('/items/:itemCode', async (req, res, next) => {
  try {
    const itemCode = +req.params.itemCode;
    const { itemName, itemStat } = req.body;

    const updatedItem = await itemPrisma.items.findOneAndUpdate(
      { itemCode },
      { itemName, itemStat },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(400)
        .json({ message: '아이템을 찾을 수 없습니다' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

/** 아이템 목록 조회 API */
router.get('/items', async (req, res, next) => {
  try {
    const itemList = await itemPrisma.items.findMany({
        select:{
            itemCode:true,
            itemName:true,
            itemPrice:true
        }
    });

    res.status(200).json(itemList);
  } catch (error) {
    console.error('Error retrieving items', error);
    res.status(500).json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

/** 아이템 상세 조회 API */
router.get('/items/:itemCode', async (req, res, next) => {
  try {
    const itemCode = +req.params.itemCode;
    const item = await itemPrisma.items.findOne({ itemCode });
    if (!item) {
      return res.status(404).json({ message: '아이템을 찾을 수 없습니다.' });
    }

    const itemDetailInfo = {
      itemCode: item.itemCode,
      itemName: item.itemName,
      itemStat: item.itemStat,
      itemPrice: item.itemPrice,
    };
    res.status(200).json({ itemDetailInfo });
  } catch (error) {
    console.error('Error retrieving items', error);
    res.status(500).json({ message: '데이터 베이스에서 아이템 검색을 실패했습니다.' });
  }
});

exports.router = router;