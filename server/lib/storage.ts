import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"

const prisma = new PrismaClient();
const redis = new Redis(useRuntimeConfig().redisUrl);

export const usePrisma = () => prisma;
export const useRedis = () => redis;
