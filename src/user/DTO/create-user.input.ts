import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Campo nome não pode ser vazio.' })
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Campo e-mail não pode ser vazio.' })
  email: string;
}
