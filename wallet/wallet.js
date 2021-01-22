const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet {
    constructor(secret) {
        this.balance = 0;
        this.keyPair = ChainUtil.genKeyPair(secret);
        this.publicKey = this.keyPair.getPublic("hex");
    }

    toString() {
        return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash).toHex();
    }

    createTransaction(to, amount, type, blockchain, transactionPool) {
        this.balance = this.getBalance(blockchain);
        if(amount > (this.balance - transactionPool.poolSpending(this.publicKey))) {
            console.log(`Amount: ${amount} exceeds the current balance: ${this.balance - transactionPool.poolSpending(this.publicKey)}`);
            return;
        }
        
        let transaction = Transaction.newTransaction(this, to, amount, type);
        transactionPool.addTransaction(transaction);
        return transaction;
    }

    getBalance(blockchain) {
        return blockchain.getBalance(this.publicKey);
    }

    getPublicKey() {
        return this.publicKey;
    }
}

module.exports = Wallet;