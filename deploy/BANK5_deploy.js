'use strict'

module.exports = mode => {
    const path = require('path')
    const fs = require('fs')



    const Web3 = require('web3')
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

    const bank5_abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank5Contract.abi')))
    const bank5_bytecode = '0x' + fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank5Contract.bin')).toString()

    const Bank5Contract = web3.eth.contract(bank5_abi)

    return (new Promise((res, rej) => {
        Bank5Contract.new(10000000, web3.eth.accounts[0], web3.eth.accounts[3], {
            from: web3.eth.coinbase,
            gas: 4700000,
            data: bank5_bytecode
        }, (err, bank) => {
            if (err) {
                return rej(err)
            }

            if (bank.address !== undefined && bank.address !== null) {
                console.log('BANK5_ADDRESS', bank.address)
                return res(bank.address)
            }
        })
    }))
}
