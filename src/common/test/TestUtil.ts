import { User } from '../../user/user.entity';

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Teste da Silva';
    user.id = '1';

    return user;
  }
}
