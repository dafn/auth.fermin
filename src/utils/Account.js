const assert = require('assert');
const _ = require('lodash');
const { USERS } = require('../database/users')
const { SHA512 } = require('./SHA512')

class Account {
  constructor(id) {
    this.accountId = id;
  }

  // claims() should return or resolve with an object with claims that are mapped 1:1 to
  // what your OP supports, oidc-provider will cherry-pick the requested ones automatically
  claims() {
    return Object.assign({}, USERS[this.accountId], {
      sub: this.accountId,
    });
  }

  static async findById(ctx, id) {
    // this is usually a db lookup, so let's just wrap the thing in a promise, oidc-provider expects
    // one
    return new Account(id);
  }

  static async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');

      const id = _.findKey(USERS, { email: String(email).toLowerCase(), password: SHA512(password) });

      assert(id, 'invalid credentials provided');

      return new this(id);
    } catch (err) {
      return undefined;
    }
  }
}

module.exports = Account;
