# Elections smart contract

Made by Vilnius University students Paulius Zaranka (front-end) and Paulius Mykolaitis (back-end) 2020

# What you will need to run app?

- Install or have installed NodeJS;

- Install or have installed Ganache for local blockchain;

- Install or have installed Truffle for smart contract develop;

- Install or have installed Metamask for interaction with DApp

# Goal

Our goal was to create a working voting system which prevents double voting by the same account (every Ethereum account can only vote once). The voting is almost free but needs gas for the transaction fee. After every vote, smart contract is updated, shows updated results and same account no longer can vote.

# How to use?

- Firstly, clone our DApp repository with **https://github.com/pablozz/vu-blockchain-dapp.git**;

- Then, navigate to directory where clonned repository is;

- Run Ganache;

- Use *Truffle compile* and after compiling use *Truffle migrate*;

- Use *npm install* to install required packages;

- Type *npm run dev* after installing packages;

- Connect metamask to Ganache and start using DApp.




