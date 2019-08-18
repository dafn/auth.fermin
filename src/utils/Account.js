const assert = require('assert');
const findKey = require('lodash/findKey');
const USERS = require('../database/users')
const SHA512 = require('./SHA512')

class Account {
  constructor(id) {
    this.accountId = id;
  }

  // claims() should return or resolve with an object with claims that are mapped 1:1 to
  // what your OP supports, oidc-provider will cherry-pick the requested ones automatically
  claims() {
    return Object.assign({}, {
      sub: this.accountId,
      email: USERS[this.accountId].email
    });
  }

  static async findById(ctx, id) {
    return new Account(id);
  }

  static async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');

      const id = findKey(USERS, { email: String(email).toLowerCase(), password: SHA512(password) });

      assert(id, 'invalid credentials provided');

      return new this(id);
    } catch (err) {
      return undefined;
    }
  }
}

module.exports = Account;
