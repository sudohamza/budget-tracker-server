import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncomeModule } from './income/income.module';
import { JwtMiddleware } from './middleware/jwtMiddleware';
import { JwtService } from '@nestjs/jwt';
import { ExpenseModule } from './expense/expense.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local.env' }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNC'),
      }),
      inject: [ConfigService],
    }),
    IncomeModule,
    ExpenseModule,
    GoalsModule,
  ],
  controllers: [],
  providers: [JwtService],
  exports: [],
})
export class RootModule implements NestModule {
  constructor() {
    console.log('App is Running');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/logout', method: RequestMethod.GET },
        { path: 'user/oauth/google/login', method: RequestMethod.GET },
        { path: 'user/oauth/google/verify', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
