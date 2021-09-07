import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/auth.guard';

import { CreateUserInput } from './DTO/create-user.input';
import { UpdateUserInput } from './DTO/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findAllUsers();

    return users;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(
    @Args('id', { nullable: true }) id?: string,
    @Args('email', { nullable: true }) email?: string,
  ): Promise<User> {
    const handleFindUser = async () => {
      console.log(id);
      if (id) {
        return this.userService.findUserById(id);
      }

      return this.userService.findUserByEmail(email);
    };

    const user = await handleFindUser();

    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    const user = await this.userService.createUser(data);

    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userService.updateUser(id, data);

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    const deleted = await this.userService.deleteUser(id);

    return deleted;
  }
}
