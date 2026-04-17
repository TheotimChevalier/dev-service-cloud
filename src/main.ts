import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser le front déployé sur Google Cloud via CORS
    // Configuration CORS pour autoriser le front déployé
    app.enableCors({
      origin: 'https://dev-service-cloud-front-73599099399.europe-west1.run.app',
      credentials: true, // Active si tu utilises des cookies ou l’authentification
    });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Cloud App API')
    .setDescription('API de gestion de produits - Module Cloud Natives')
    .setVersion('1.0.0')
    .addTag('products', 'Gestion des produits')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // use the port provided by the environment (Cloud Run sets PORT=8080)
  const port = parseInt(process.env.PORT || '8080', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);

}
bootstrap();
