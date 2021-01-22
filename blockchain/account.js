class Account {
    constructor() {
        this.addresses = ["ba4d5b8adc35f1bd1613ceb703d40967ad5d7e007e5f8cce643e0f093c7cd5f2"];
        this.balance = {"ba4d5b8adc35f1bd1613ceb703d40967ad5d7e007e5f8cce643e0f093c7cd5f2": 24e25};
    }

    initialize(address) {
        if (this.balance[address] === undefined) {
            this.balance[address] = 0;
            this.addresses.push(address);
        }
    }

    transfer(from, to, amount) {
        this.initialize(from);
        this.initialize(to);
        this.increment(to,amount);
        this.decrement(from,amount);
    }

    increment(to, amount) {
        this.balance[to] += amount;
    }

    decrement(from, amount) {
        this.balance[from] -= amount;
    }

    getBalance(address){
        this.initialize(address);
        return this.balance[address];
    }

    update(transaction) {
        let amount = transaction.output.amount;
        let from = transaction.input.from;
        let to = transaction.output.to;
        this.transfer(from,to,amount);
    }

    transferFee(block, transaction) {
        let amount = transaction.output.fee;
        let from = transaction.input.from;
        let to = block.validator;
        this.transfer(from, to, amount);
    }
}

module.exports = Account;