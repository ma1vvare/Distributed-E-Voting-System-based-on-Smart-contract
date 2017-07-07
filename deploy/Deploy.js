'use strict'

const path = require('path')
const fs = require('fs')

const bank2_build = require('./BANK2_deploy.js')
const bank4_build = require('./BANK4_deploy.js')
const bank5_build = require('./BANK5_deploy.js')
const gentxn_build = require('./GenTxnSeqContract_deploy.js')

// "release" or "debug"

const result = {}

bank2_build()
	.then(bank2_address => {
		result.bank2 = {
			address: bank2_address
		}


	})
bank4_build()
	.then(bank4_address => {
		result.bank4 = {
			address: bank4_address
		}
	})

bank5_build()
	.then(bank5_address => {
		result.bank5 = {
			address: bank5_address
		}
	})

gentxn_build()
	.then(gen_address => {
		result.gen = {
			address: gen_address
		}


		// load coinbase
		const Web3 = require('web3')
		const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
		result.coinbase = web3.eth.coinbase

		// in build dir
		fs.writeFileSync(path.resolve(__dirname, '..', 'build', 'result.json'), JSON.stringify(result, null, 4))

		// for frontend address
		const address_str = `
			var bank2_address = '${result.bank2.address}';
			var bank4_address = '${result.bank4.address}';
			var bank5_address = '${result.bank5.address}';
			var gen_address = '${result.gen.address}';`
    const smartcontract=`${result.bank2.address}`

		fs.writeFileSync(path.resolve(__dirname, '..', 'frontend_abi_address', 'address.js'), address_str)
    fs.writeFileSync(path.resolve(__dirname, '..', 'frontend_abi_address', 'addr.js'), smartcontract)
		// for frontend abi
		const bank2_abi = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank2Contract.abi'))
		const bank4_abi = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank4Contract.abi'))
		const bank5_abi = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'Bank5Contract.abi'))
		const gen_abi = fs.readFileSync(path.resolve(__dirname, '..', 'build', 'GenTxnSeqContract.abi'))
		const abi_str = `
			var bank2_abi = ${bank2_abi};
			var bank4_abi = ${bank4_abi};
			var bank5_abi = ${bank5_abi};
			var gen_abi = ${gen_abi};`
		const abi_2=`${bank2_abi}`
		fs.writeFileSync(path.resolve(__dirname, '..', 'frontend_abi_address', 'abi.js'), abi_str)
    fs.writeFileSync(path.resolve(__dirname, '..', 'frontend_abi_address', 'abi_2.js'), abi_2)
		console.log('all good')
	})
	.catch(err => console.log(err))
