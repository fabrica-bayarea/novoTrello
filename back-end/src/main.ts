import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Novo Trello API - IESB')
    .setDescription(
      'Documentação da API do novo trello do BayArea - IESB',
    )
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
     'https://github.com/fabrica-bayarea/novoTrello?tab=GPL-3.0-1-ov-file'
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Prontuario API - IESB',
    customfavIcon:
      'https://www.iesb.br/content/themes/iesb-chleba-themosis/favicon.png',
    customCss: `
      .swagger-ui .topbar { background: transparent linear-gradient(96deg, #CC0000 0%, #F00B54 100%) 0% 0% no-repeat padding-box; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
