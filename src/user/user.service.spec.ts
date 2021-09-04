import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../common/test/TestUtil';

import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const user = TestUtil.giveMeAValidUser();

  describe('When search All Users', () => {
    it('should be list all user', async () => {
      const userList = [user, user];
      mockRepository.find.mockReturnValue(userList);

      const users = await service.findAllUsers();
      expect(users).toEqual(userList);
      expect(mockRepository.find).toBeCalledTimes(1);
    });
  });

  describe('When search a User By Id', () => {
    it('should find an existing user', async () => {
      mockRepository.findOne.mockReturnValue(user);

      const userById = await service.findUserById('1');
      expect(userById).toMatchObject(user);
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });

    it('should throw an exception when not finding a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      expect(service.findUserById('1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When create a user', () => {
    it('should create a user', async () => {
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);

      const createdUser = await service.createUser({
        email: user.email,
        name: user.name,
      });

      expect(createdUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should throw an exception when not creating a user', async () => {
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(null);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema ao criar um usuário.',
        });
      });

      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update a User', () => {
    it('should update a user', async () => {
      const updatedUserData = { ...user, name: 'João do Teste' };

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue(updatedUserData);
      mockRepository.create.mockReturnValue(updatedUserData);

      const updatedUser = await service.updateUser('1', updatedUserData);

      expect(updatedUser).toMatchObject(updatedUserData);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When delete a User', () => {
    it('should delete a user', async () => {
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('Shoud not delete an indexisting user', async () => {
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.deleteUser('9');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
