import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userDocument } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { CustomError } from 'src/filter/Error';
import { OTPGenerator } from 'src/helper/otp';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const bcrypt = require('bcrypt');

const mailerSend = new MailerSend({
  apiKey:
    'mlsn.f7e916c0223727f9101aed36a041b40c0b8ca73a210e2aae0f6cef1cf791d7e0',
});

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private UserModel: Model<userDocument>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private jwtService: JwtService,
    private OTP: OTPGenerator,
  ) {}

  async signup(data) {
    const { password, email } = data;
    const user = await this.UserModel.findOne({ email: email });
    if (user) {
      throw new CustomError('user already exist', 401);
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const otp = await this.OTP.generateSixDigitRandomNumber();
    const signupUser = new this.UserModel({
      ...data,
      password: hash,
      otp: otp,
    });
    const sentFrom = new Sender(
      'MS_Syqc83@trial-zr6ke4nj1jygon12.mlsender.net',
      'blaze',
    );

    const recipients = [new Recipient(email, email)];

    // const emailParams = new EmailParams()
    //   .setFrom(sentFrom)
    //   .setTo(recipients)
    //   .setReplyTo(sentFrom)
    //   .setSubject('test')
    //   .setHtml(
    //     `<!DOCTYPE html>
    //         <html lang="en">
    //         <head>
    //             <meta charset="UTF-8">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             <title>Purple Background</title>
    //             <style>
    //                 body {
    //                     font-family: Arial, sans-serif;
    //                     margin: 0;
    //                     padding: 0;
    //                     background-color: purple;
    //                     color: white;
    //                 }
    //                 .content {
    //                     padding: 20px;
    //                 }
    //                 img {
    //                     max-width: 100%;
    //                     height: auto;
    //                     display: block;
    //                     margin: 0 auto;
    //                     border-radius: 10px;
    //                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <div class="content">
    //             <img src="https://via.placeholder.com/400" alt="Placeholder Image">
    //                <h1>Welcome to Blaze</h1>
    //                 <p>Your OTP is ${otp}</p>
    //             </div>
    //         </body>
    //         </html>`,
    //   )
    //   .setText(`This is otp:${otp}`);

    // await mailerSend.email.send(emailParams);
    const res = await signupUser.save();
    if (res) {
      return true;
    }
  }

  async verifyPass(password, cachedData) {
    const result = await bcrypt.compare(password, cachedData.password);
    if (result) {
      const payload = { id: cachedData.id, email: cachedData.email };
      const jwt_token = await this.jwtService.signAsync(payload);
      return jwt_token;
    }
  }

  async login(data) {
    const { email, password } = data;

    const cachedData: any = await this.cacheService.get(email);

    if (cachedData) {
      console.log('cachedData', cachedData);

      return await this.verifyPass(password, cachedData);
    }
    const user = await this.UserModel.findOne({ email: email });
    await this.cacheService.set(email,user,0);
    if (user) {
      return await this.verifyPass(password, user);
    }
  }

  async verifyOtp(data) {
    const { email, otp } = data;

    const user = await this.UserModel.findOne({ email: email });
    console.log(user);
    if (user) {
      if (user.otp === otp) {
        await this.UserModel.findOneAndUpdate({ email: email }, { otp: '' });
        return true;
      }
    }
  }

  async getAll() {
    const user = await this.UserModel.find();
    // await this.cacheService.set(email,user,0);
    if (user) {
      return user;
    }
  }
}
