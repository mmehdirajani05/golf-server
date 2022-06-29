/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as serviceAccount  from './constants/serviceAccount.json'
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Golf Server App')
    .setDescription('Golf server API specs')
    .setVersion('1.0')
    .addTag('golf server')
    .build();
  const document = SwaggerModule.createDocument(app, config); 
 
  admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount as ServiceAccount)
    credential: admin.credential.cert(require('./constants/serviceAccount.json'))
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
