import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public async createToken(user: any): Promise<string> {
        console.log("user:", user);
        const payload: T = {};

        Object.keys(user['_doc'] ? user['_doc'] : user).map((ele) => {
            payload[`${ele}`] = user[`${ele}`];
        });
        delete payload.memberPassword;
        
        return await this.jwtService.signAsync(payload);
    }

    public async verifyToken<T = any>(token: string): Promise<T> {
        const decoded = await this.jwtService.verifyAsync(token);
        return decoded;
    }
}