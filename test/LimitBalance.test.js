import assertRevert from './helpers/assertRevert';
var LimitBalanceMock = artifacts.require('mocks/LimitBalanceMock.sol');

contract('LimitBalance', function (accounts) {
  let lb;

  beforeEach(async function () {
    lb = await LimitBalanceMock.new();
  });

  let LIMIT = 1000;

  it('should expose limit', async function () {
    let limit = await lb.limit();
    assert.equal(limit, LIMIT);
  });

  it('should allow sending below limit', async function () {
    let amount = 1;
    await lb.limitedDeposit({ value: amount });

    assert.equal(web3.eth.getBalance(lb.address), amount);
  });

  it('shouldnt allow sending above limit', async function () {
    let amount = 1110;
    await assertRevert(lb.limitedDeposit({ value: amount }));
  });

  it('should allow multiple sends below limit', async function () {
    let amount = 500;
    await lb.limitedDeposit({ value: amount });

    assert.equal(web3.eth.getBalance(lb.address), amount);

    await lb.limitedDeposit({ value: amount });
    assert.equal(web3.eth.getBalance(lb.address), amount * 2);
  });

  it('shouldnt allow multiple sends above limit', async function () {
    let amount = 500;
    await lb.limitedDeposit({ value: amount });

    assert.equal(web3.eth.getBalance(lb.address), amount);
    await assertRevert(lb.limitedDeposit({ value: amount + 1 }));
  });
});
