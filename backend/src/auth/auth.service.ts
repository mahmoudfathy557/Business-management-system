import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto, CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email, isActive: true });
    if (user && await bcrypt.compare(password, user.password)) {

      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.loginWithUser(user);
  }

  async loginWithUser(user: any) {
    // Update last login
    await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await user.save();

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

}
