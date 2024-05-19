import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/helper/roles.decorator";
import { Role } from "src/helper/roles.enum";
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private readonly reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const isPublic = this.reflector.get<boolean>( "isPublic", context.getHandler() );

        const token = this.extractTokenFromHeader(request);


		if ( isPublic ) {
			return true;
		}

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: 'bsha$6SSAgsabj'
                }
            );

            request['user'] = payload;

        } catch {
            throw new UnauthorizedException();
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}