import { Controller, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filter/Exception.filter';
import { OTPGenerator } from 'src/helper/otp';


@Module({
  imports: [UserModule,JwtModule.register({
    global: true,
    secret:'bsha$6SSAgsabj',
    signOptions: {expiresIn: '7d'}
  })],
  controllers: [AuthController],
  providers: [UserService,AuthService,OTPGenerator],
})
export class AuthModule {}
