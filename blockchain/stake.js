class Stake {
    constructor() {
        this.addresses = ["ba4d5b8adc35f1bd1613ceb703d40967ad5d7e007e5f8cce643e0f093c7cd5f2"];
        this.balance = {"ba4d5b8adc35f1bd1613ceb703d40967ad5d7e007e5f8cce643e0f093c7cd5f2": 0};
    }

    initialize(address) {
        if(this.balance[address] == undefined) {
            this.balance[address] = 0;
            this.addresses.push(address);
        }
    }

    addStake(from, amount) {
        this.initialize(from);
        this.balance[from] += amount;
    }

    getStake(address) {
        this.initialize(address);
        return this.balance[address];
    }

    getMax(addresses) {
        let balance = -1;
        let leader = undefined;
        addresses.forEach(address => {
            if(this.getStake(address) > balance) {
                leader = address
            }
        });
        return leader;
    }

    update(transaction) {
        let amount = transaction.output.amount;
        let from = transaction.input.from;
        this.addStake(from, amount);
    }
}

module.exports = Stake;