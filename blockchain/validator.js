class Validators {
    constructor() {
        this.list = ["ba4d5b8adc35f1bd1613ceb703d40967ad5d7e007e5f8cce643e0f093c7cd5f2"];
    }

    update(transaction) {
        if(transaction.output.amount == 30 && transaction.output.to == "0") {
            this.list.push(transaction.input.from);
            console.log("New Validator:", transaction.input.from);
            return true;
        }
        return false;
    }
}

module.exports = Validators;