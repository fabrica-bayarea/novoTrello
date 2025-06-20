import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const DEBUG = configService.get<string>('DEBUG') === 'true';
  const PRODUCTION = configService.get<string>('NODE_ENV') === 'production';
  const CORS_ORIGIN = configService.get<string>('CORS_ORIGIN') || '*';
  const PORT = configService.get<string>('PORT') ?? 3000;

  app.useLogger(
    DEBUG
      ? ['log', 'error', 'warn', 'debug', 'verbose']
      : ['log', 'error', 'warn'],
  );

  const logger = new Logger('Bootstrap');

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Middleware
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: PRODUCTION
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", 'https://apis.google.com'],
              styleSrc: ["'self'", 'https://fonts.googleapis.com'],
              imgSrc: ["'self'"],
              fontSrc: ["'self'", 'https://fonts.googleapis.com'],
              connectSrc: ["'self'"],
              frameAncestors: ["'self'"],
            },
          }
        : false,
      frameguard: {
        action: 'sameorigin',
      },
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Novo Trello API - IESB')
    .setDescription('Documentação da API do novo trello do BayArea - IESB')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .setExternalDoc(
      'Documentação adicional',
      'https://github.com/fabrica-bayarea/novoTrello',
    )
    .setContact('BayArea', '', 'nde.ads@iesb.br')
    .setLicense(
      'License GPL-3.0',
      'https://github.com/fabrica-bayarea/novoTrello?tab=GPL-3.0-1-ov-file',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Novo Trello API - IESB',
    customfavIcon:
      'https://www.iesb.br/content/themes/iesb-chleba-themosis/favicon.png',
    customCss: `
      .swagger-ui .topbar { 
        background: transparent linear-gradient(96deg, #CC0000 0%, #F00B54 100%) 0% 0% no-repeat padding-box; 
      }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head'],
    },
  });

  // Start the application
  await app.listen(PORT);
  logger.log(`Application is running on: http://localhost:${PORT}`);

  process.on('SIGINT', async () => {
    logger.log('Recebido SIGINT. Desligando...');
    await app.close();
    logger.log('Aplicação desligada.');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.log('Recebido SIGTERM. Desligando...');
    await app.close();
    logger.log('Aplicação desligada.');
    process.exit(0);
  });
}
bootstrap();
