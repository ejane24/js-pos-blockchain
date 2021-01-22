const Block = require('./block');
const Account = require("./account");
const Stake = require("./stake");
const Validator = require("./validator");
const Wallet = require('../wallet/wallet');

const TRANSACTION_TYPE = {
    transaction: "TRANSACTION",
    stake: "STAKE",
    validator_fee: "VALIDATOR_FEE"
  };

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.accounts = new Account();
        this.stakes = new Stake();
        this.validators = new Validator();
    }

    addBlock(data) {
        let timestamp = data['timestamp'];
        let lastHash = data['lastHash'];
        let hash = data['hash'];
        let _data = data['data'];
        let validator = data['validator'];
        let signature = data['signature']
        const block = new Block(timestamp, lastHash, hash, _data, validator, signature);
        this.chain.push(block)

        return block;
    }

    isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            console.log('genesis incorrect');
            return false;
        }

        for(let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];
            if((block.lastHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block))) {
                return false;
            }
        }

        return true;
        
    }

    isValidBlock(block) {
        const lastBlock = this.chain[this.chain.length - 1];

        if(block.lastHash === lastBlock.hash &&
            block.hash === Block.blockHash(block) &&
            Block.verifyBlock(block) &&
            Block.verifyLeader(block, this.getLeader())) 
        {
            console.log("block valid");
            this.addBlock(block);
            this.executeTransactions(block);
            return true;
        } else {
            return false;
        }
    }

    replaceChain(newChain) {
        if(newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current chain");
            return;
        } else if(!this.isValidChain(newChain)) {
            console.log("Received chain is invalid");
            return;
        }

        console.log("Replacing current chain with the new chain");
        this.resetState();
        this.executeChain(newChain);
        this.chain = newChain;
    }

    getBalance(publicKey) {
        return this.accounts.getBalance(publicKey);
    }

    getLeader() {
        return this.stakes.getMax(this.validators.list);
    }

    initialize() {
        this.accounts.initialize(address);
        this.stakes.initialize(address);
    }

    createBlock(transactions, wallet) {
        const block = Block.createBlock(this.chain[this.chain.length - 1], transactions, wallet);
        return block;
    }

    executeTransactions(block) {
        block.data.forEach(transaction => {
            switch(transaction.type) {
                case TRANSACTION_TYPE.transaction:
                    this.accounts.update(transaction);
                    this.accounts.transferFee(block, transaction);
                    break;
                case TRANSACTION_TYPE.stake:
                    this.stakes.update(transaction);
                    this.accounts.decrement(transaction.input.from, transaction.output.amount);
                    this.accounts.transferFee(block, transaction);
                    break;
                case TRANSACTION_TYPE.validator_fee:
                    if(this.validators.update(transaction)) {
                        this.accounts.decrement(transaction.input.from, transaction.output.amount);
                        this.accounts.transferFee(block, transaction);
                    }
                    break;
            }
        });
    }

    executeChain(chain) {
        chain.forEach(block => {
            this.executeTransactions(block);
        });
    }

    resetState() {
        this.chain = [Block.genesis()];
        this.stakes = new Stake();
        this.accounts = new Account();
        this.validators = new Validators();
    }
}

module.exports = Blockchain;