import { Test, TestingModule } from '@nestjs/testing';
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
});
