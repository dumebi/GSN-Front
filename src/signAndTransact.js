const EthereumTx = require('ethereumjs-tx').Transaction;

export async function signAndTransact(web3, privateKey, details) {
  const transaction = new EthereumTx(details, { chain: 'ropsten' });
  transaction.sign(Buffer.from(`${privateKey}`, 'hex'));
  const serializedTransaction = transaction.serialize();
  const addr = transaction.from.toString('hex');
  console.log(`Based on your private key, your wallet address is 0x${addr}`);
  const res = await web3.eth.sendSignedTransaction(`0x${serializedTransaction.toString('hex')}`);
  console.log('TxHash', `https://ropsten.etherscan.io/tx/${res.transactionHash}`);
  return res;
}
