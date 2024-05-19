import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guard/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { usersSchema } from './user.schema';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'users', schema: usersSchema }])],
  controllers: [UserController],
  providers: [UserService,{provide:'KEY',useValue:'123'}],
  exports:[UserService,MongooseModule]
})
export class UserModule {}
