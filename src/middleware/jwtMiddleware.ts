import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let key = this.configService.get('JWT_SECRET');
    const tokens = req.cookies.token;
    try {
      const payload = await this.jwtService.verifyAsync(tokens, {
        secret: key,
      });
      res.locals.user = payload.sub;
    } catch (err) {
      throw new UnauthorizedException('cooke problem');
    }
    next();
  }
}
