'use strict'

module.exports = mode => {
    const path = require('path')
    const fs = require('fs')


    const Web3 = require('web3')
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

    const gen_abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'build', 'GenTxnSeqContract.abi')))
    const gen_bytecode = '0x' + fs.readFileSync(path.resolve(__dirname, '..', 'build', 'GenTxnSeqContract.bin')).toString()

    const GenContract = web3.eth.contract(gen_abi)

    return (new Promise((res, rej) => {
        GenContract.new(0, web3.eth.accounts[0], {
            from: web3.eth.coinbase,
            gas: 4700000,
            data: gen_bytecode
        }, (err, gen) => {
            if (err) {
                return rej(err)
            }

            if (gen.address !== undefined && gen.address !== null) {
                console.log('GEN_ADDRESS', gen.address)
                return res(gen.address)
            }
        })
    }))
}
