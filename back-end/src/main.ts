import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Middleware
  app.use(cookieParser());

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
  const port = configService.get<string>('PORT') ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
