'use strict'

module.exports = mode => {
    const path = require('path')
    const fs = require('fs')


    const Web3 = require('web3')
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

    const bank2_abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank2Contract.abi')))
    const bank2_bytecode = '0x' + fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank2Contract.bin')).toString()

    const Bank2Contract = web3.eth.contract(bank2_abi)

    return (new Promise((res, rej) => {
        Bank2Contract.new(10000000, web3.eth.accounts[0], web3.eth.accounts[1], {
            from: web3.eth.coinbase,
            gas: 4700000,
            data: bank2_bytecode
        }, (err, bank) => {
            if (err) {
                return rej(err)
            }

            if (bank.address !== undefined && bank.address !== null) {
                console.log('BANK2_ADDRESS', bank.address)
                return res(bank.address)
            }
        })
    }))
}

