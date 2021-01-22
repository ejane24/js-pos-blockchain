const Transaction = require("./transaction");

const {TRANSACTION_THRESHOLD, TRANSACTION_FEE} = require('../config');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    thresholdReached() {
        if(this.transactions.length >= TRANSACTION_THRESHOLD) {
            return true;
        } else {
            return false;
        }
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        if(this.transactions.length >= TRANSACTION_THRESHOLD) {
            return true;
        } else {
            return false;
        }
    }

    transactionsBy(address) {
        return this.transactions.filter(transaction => {
            return transaction.input.from === address;
        });
    }

    poolSpending(address) {
        let transactions = this.transactionsBy(address);
        let total = 0;
        transactions.forEach(transaction => {
            total += transaction.output.amount;
        });
        return total;
    }

    validTransactions() {
        return this.transactions.filter(transaction => {
            if(!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.data.from}`);
                return;
            }

            return transaction;
        });
    }

    transactionExists(transaction) {
        if(this.transactions.length == 0) {
            return false;
        }
        let exists = this.transactions.find(t => t.id === transaction.id);
        return exists;
    }

    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;