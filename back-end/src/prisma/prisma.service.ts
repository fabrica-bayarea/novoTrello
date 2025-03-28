import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Serviço responsável por gerenciar a conexão com o banco de dados utilizando o Prisma.
 * 
 * O `PrismaService` estende `PrismaClient` e implementa os métodos `OnModuleInit` e `OnModuleDestroy`
 * para garantir que a conexão com o banco seja aberta e fechada corretamente dentro do ciclo de vida do NestJS.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  /**
   * Método chamado quando o módulo que contém este serviço é inicializado.
   * Ele estabelece a conexão com o banco de dados através do Prisma.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Método chamado quando o módulo que contém este serviço é destruído.
   * Ele encerra a conexão com o banco de dados para evitar conexões não gerenciadas.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
