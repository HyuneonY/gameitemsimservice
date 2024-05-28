// src/utils/prisma/index.js

const { PrismaClient: UserPrismaClient } = require("../../../prisma/generated/client1");
const { PrismaClient: ItemPrismaClient } = require("../../../prisma/generated/client2");

const userPrisma = new UserPrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ["query", "info", "warn", "error"],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: "pretty",
}); // PrismaClient 인스턴스를 생성합니다.

const itemPrisma = new ItemPrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ["query", "info", "warn", "error"],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: "pretty",
}); // PrismaClient 인스턴스를 생성합니다.

exports.userPrisma = userPrisma;
exports.itemPrisma = itemPrisma;