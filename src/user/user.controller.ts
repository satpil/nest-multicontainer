import { Controller,Get,Req,Post,Param,Query, Body,HttpStatus, Patch, Inject, UseFilters, NotFoundException, UsePipes, ParseIntPipe, UseInterceptors} from "@nestjs/common";
import {Request} from 'express';
import { UserService } from "./user.service";
import { HttpExceptionFilter } from "src/filter/Exception.filter";
import { CustomError } from "src/filter/Error";
import { User } from "src/dto/User.dto";
import { YupValidationPipe } from "src/pipe/CustomPipe.pipe";
import UserValidationSchema from "./user.validation";
import { Roles } from "src/helper/roles.decorator";
import { Role } from "src/helper/roles.enum";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Public } from "src/helper/public.decorator";

@Controller('user')
// @UseInterceptors(CacheInterceptor)
export class UserController{
  
   constructor(
       private User:UserService,
       @Inject('KEY') private key: number,
   ){}


 @Get()
 @Public()
 getAllUser(){
   // throw new CustomError('User not found',400)
    return this.User.getAll()
 }

 @Get(':id')
 getlUser(@Param('id',ParseIntPipe) id: Request){
    return this.User.getUser(id)
 }


 @Post()
 @Public()
 @UsePipes(new YupValidationPipe(UserValidationSchema))
 createUser(@Body() body: User){
    const res = this.User.setUser(body)
    if(res){
      return {message:'User created',status: HttpStatus.CREATED}
    }
 }


 @Patch()
 async updateUser(@Query('id') id: Request,@Body() body: Request){
    console.log(id,body)
    const res = await this.User.updateUser(id,body)
    console.log(res)
    if(res){
      return {message:'User updated',status: HttpStatus.ACCEPTED}
    }
    return 'No User Found'
 }


}