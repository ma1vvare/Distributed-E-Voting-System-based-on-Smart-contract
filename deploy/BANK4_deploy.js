'use strict'

module.exports = mode => {
    const path = require('path')
    const fs = require('fs')



    const Web3 = require('web3')
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

    const bank4_abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank4Contract.abi')))
    const bank4_bytecode = '0x' + fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank4Contract.bin')).toString()

    const Bank4Contract = web3.eth.contract(bank4_abi)

    return (new Promise((res, rej) => {
        Bank4Contract.new(10000000, web3.eth.accounts[0], web3.eth.accounts[2], {
            from: web3.eth.coinbase,
            gas: 4700000,
            data: bank4_bytecode
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
