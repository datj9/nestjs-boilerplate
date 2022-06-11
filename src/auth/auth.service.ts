import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';
import { User } from './entities/User';
import Hashing from './hashing';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepo.create({
        ...createUserDto,
        password: await Hashing.hash(createUserDto.password),
      });
      await this.userRepo.save(newUser);

      delete newUser.password;

      return newUser;
    } catch (error) {
      console.log(error, 'error');
      if (error.code === 'ER_DUP_ENTRY') {
        return { message: 'User already exists', code: 'duplicated_user' };
      }
    }
  }
}
