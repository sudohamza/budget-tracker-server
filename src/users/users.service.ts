import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UsersService {
  oauthClient: OAuth2Client;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.oauthClient = new google.auth.OAuth2(
      this.config.get('GOOGLE_CLIENT_ID'),
      this.config.get('GOOGLE_CLIENT_SECRET'),
      'http://localhost:5173/oauth/google/callback',
    );
  }

  async register(createUserDto: CreateUserDto): Promise<string> {
    if (
      await this.userRepository.findOne({
        where: { email: createUserDto.email },
      })
    ) {
      throw new ForbiddenException('User with this email already exist.');
    }
    let user = new User();
    let hash = await argon.hash(createUserDto.password);
    user.fullName = createUserDto.fullName;
    user.email = createUserDto.email;
    user.passwordHash = hash;
    let createdUser = await this.userRepository.save(user);
    delete createdUser.passwordHash;
    return this.signToken(createdUser.id, createdUser.email);
  }

  async login(createUserDto: CreateUserDto) {
    let user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      if (await argon.verify(user.passwordHash, createUserDto.password)) {
        delete user.passwordHash;
        return this.signToken(user.id, user.email);
      } else {
        throw new BadRequestException('Invalid Username or Password');
      }
    } else {
      throw new BadRequestException('Invalid Username or Password');
    }
  }

  async getProfile(id: number) {
    try {
      return await this.userRepository.findOne({
        where: { id },
        select: { email: true, fullName: true },
      });
    } catch (error) {
      return error.message;
    }
  }

  async signToken(id: number, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '6h',
      secret: secret,
    });
  }
  async loginWithGoogle() {
    try {
      const url = this.oauthClient.generateAuthUrl({
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
      });
      return { url };
    } catch (error) {
      return error.message;
    }
  }
  async verifyGoogleLogin(code: string) {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      const profileApiUrl = this.config
        .get('GOOGLE_PROFILE_API')
        .replace('$token', tokens.access_token);
      const profile = await fetch(profileApiUrl);
      const json = await profile.json();
      // if user already
      const user = await this.userRepository.findOne({
        where: { email: json.email },
      });
      if (user) {
        return this.signToken(user.id, user.email);
      } else {
        const user = new User();
        user.fullName = json.name;
        user.email = json.email;
        user.provider = 'google';
        user.passwordHash = '*';
        const newUser = await this.userRepository.save(user);
        return this.signToken(newUser.id, newUser.email);
      }
    } catch (error) {
      return { error: error.message };
    }
  }
}
