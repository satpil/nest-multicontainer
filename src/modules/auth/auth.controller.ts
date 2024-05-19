import { Body, Controller, Get, HttpStatus, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from 'src/helper/public.decorator';
import { HttpExceptionFilter } from 'src/filter/Exception.filter';
import { CacheInterceptor } from '@nestjs/cache-manager';


@Controller('auth')
@UseInterceptors(CacheInterceptor)

export class AuthController {
    constructor(private User: UserService, private auth: AuthService) { }

    //TODO: need proper validation using either yup or DTO level validation
    @Public()
    @Post('signup')
    async signup(@Body() body: AuthDTO) {
        const res = await this.auth.signup(body)
        if (res) {
            return { message: 'User Signup Successfully', status: HttpStatus.CREATED }
        }
    }

    @Public()
    @Post('login')
    async login(@Body() body: AuthDTO) {
        const res = await this.auth.login(body);
        if (res) {
            return { body:{token:res},message: 'User Login Successfully', status: HttpStatus.CREATED }
        }
        return { message: 'email/password is incorrect', status: HttpStatus.UNAUTHORIZED }
    }

    @Public()
    @Post('verifyOTP')
    async verifyOtp(@Body() body: AuthDTO) {
        const res = await this.auth.verifyOtp(body);
        if (res) {
            return { message: 'User verified', status: HttpStatus.CREATED }
        }
        return { message: 'incorrect otp', status: HttpStatus.UNAUTHORIZED }
    }

    @Get()
    getAllUser() {
        // throw new CustomError('User not found',400)
        return this.auth.getAll()
    }

}
