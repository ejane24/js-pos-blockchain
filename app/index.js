const Blockchain = require('../blockchain/blockchain');
const express = require('express');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet/wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const blockchain = new Blockchain();
const wallet = new Wallet(Date.now().toString());

const transactionPool = new TransactionPool();
const p2pserver = new P2pServer(blockchain, transactionPool, wallet);

const app = express();
app.use(bodyParser.json());

app.get('/blocks',(req,res) => {
    res.json(blockchain.chain);
});

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});

app.get('/transactions', (req,res) => {
    res.json(transactionPool.transactions);
});

app.post("/transact", (req,res) => {
    const {to, amount, type} = req.body;
    const transaction = wallet.createTransaction(to,amount,type,blockchain,transactionPool);
    if (transaction !== undefined) {
        p2pserver.broadcastTransaction(transaction)
        res.redirect('/transactions');
    } else {
        res.send('Insufficient Balance');
    }
});

// app.get("/bootstrap", (req,res) => {
//     p2pserver.bootstrapSystem();
//     res.json({message: "System bootstrapped"});
// });

app.get("/public-key", (req,res) => {
    res.json({ publicKey: wallet.getPublicKey() });
});

app.get("/balance", (req, res) => {
  res.json({ balance: blockchain.getBalance(wallet.publicKey) });
});

p2pserver.listen();