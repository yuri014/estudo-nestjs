import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Campo nome não pode ser vazio.' })
  @IsOptional()
  name?: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Campo e-mail não pode ser vazio.' })
  @IsOptional()
  email?: string;
}
