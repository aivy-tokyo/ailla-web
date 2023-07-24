import { PrismaClient } from "@prisma/client";

export var prisma: PrismaClient; 

if(process.env.NODE_ENV === 'production'){
  prisma = new PrismaClient();
}else {
  if(!globalThis.prisma){
    global.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}