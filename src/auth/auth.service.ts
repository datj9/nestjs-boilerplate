import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BadUserInput from 'src/utils/common/BadUserInput';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';
import { GetUserDto } from './dtos/GetUserDto';
import { User } from './entities/User';
import Hashing from './hashing';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.password !== createUserDto.confirmPassword) {
        return new BadUserInput('password_does_not_match_confirm_password');
      }
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
        return new BadUserInput('email_already_exists');
      }
    }
  }

  async signIn(getUserDto: GetUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: getUserDto.email },
      select: ['id', 'email', 'firstName', 'lastName', 'password'],
    });

    if (!user) {
      return new BadUserInput('email_does_not_exist');
    }

    const isValid = await Hashing.compare(getUserDto.password, user.password);
    if (!isValid) {
      return new BadUserInput('password_is_invalid');
    }
    delete user.password;
    return user;
  }
}
