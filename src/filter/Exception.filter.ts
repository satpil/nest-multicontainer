import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from '@nestjs/core';
import { CustomError } from "./Error";

@Catch(CustomError)
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: CustomError, host: ArgumentsHost) {


        const ctx = host.switchToHttp();
          const response = ctx.getResponse();
          const request = ctx.getRequest();
          const status = exception.status;
          const message = exception.message


          response.status(status).json({
            statusCode: status,
            timeStamp: new Date().toISOString(),
            message: message,
            path: request.url
          })
    }
}