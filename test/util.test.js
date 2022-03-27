const chai = require("chai")
var assert = chai.assert;
const util = require("../service/util")

describe('make first letter of each word upper case', function() {
    it('valid case', function() {
      const fixed =  util.upperCaseFirstWord("video game");
      assert.equal(fixed,"Video Game")
    });
    it('valid case 2', function() {
      const fixed =  util.upperCaseFirstWord("video");
      assert.equal(fixed,"Video")
    });
    it('valid case 3', function() {
      const fixed =  util.upperCaseFirstWord("Video");
      assert.equal(fixed,"Video")
    });
  });