<template>
<div class="container">
  <div class="row">
    <div class="col-sm-4">
      <h3>Token Symbol</h3>
      <p>{{symbol}}</p>
    </div>
    <div class="col-sm-4">
      <h3>Token Name</h3>
      <p>{{name}}</p>
    </div>
    <div class="col-sm-4">
      <h3>Total Supply</h3>        
      <p>{{Number(totalSupply).toLocaleString()}}</p>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-12">
      <h3>Minter</h3>
      <p>{{minter}}</p>
    </div>
    <div class="col-sm-6">
      <h3>User Balance</h3>
      <p>{{Number(userbalance).toLocaleString()}}</p>
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Enter your eth address</label>
          <input v-model="userAddress" type="text" class="form-control text-center" placeholder="Enter account address">
        </div>
      </form>
      <button @click="init" :disabled="userAddress < 1 || userAddress == '0x77598660059c39924d068940B26E9F3fc373261A'" type="button" class="btn btn-primary">Get Balance</button>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-6 ">
      <h3>Mint token</h3>
      <form>
        <div class="form-group">
        <label for="exampleInputEmail1">Address to mint to</label>
        <input v-model="mint.to" type="text" class="form-control" placeholder="Enter account address">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Amount of tokens to mint</label>
        <input v-model="mint.amount" type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter token amount">
      </div>
      <button @click="mintToken" :disabled="mint.amount < 1" type="button" class="btn btn-primary">Mint</button>
    </form>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-6 ">
      <h3>Transfer</h3>
      <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Address to transfer to</label>
        <input v-model="transfer.to" type="text" class="form-control" placeholder="Enter account address">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Amount of tokens to transfer</label>
        <input v-model="transfer.amount" type="number" class="form-control" placeholder="Enter transfer amount">
      </div>
      <button @click="transferToken" :disabled="transfer.amount < 1 && transfer.to.length < 0" type="button" class="btn btn-primary">Transfer</button>
    </form>
    </div>
  </div>
  <div class="row justify-content-center mb-3">
    <div class="col-sm-6 ">
      <h3>Add Minter</h3>
      <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Add minter</label>
        <input v-model="newMinter.address" type="text" class="form-control" placeholder="Enter address">
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Add minter</label>
        <input v-model="newMinter.amount" type="number" class="form-control" placeholder="Allowed amount">
      </div>
      <button @click="setMinter" :disabled="newMinter.address < 0 && newMinter.amount < 1" type="button" class="btn btn-primary">Set Minter</button>
    </form>
    </div>
  </div>
</div>
</template>

<script>
import {generateContract} from '../generateContract'
export default {
  name: 'HelloWorld',
  data: function () {
    return {
      ContractAddress: '0x61602dd79fab9CD2336D99752f3a16F0c8302DF5',
      key: '',
      transfer: {
        to: '',
        amount: 0,
      },
      mint: {
        to: '',
        amount: 0,
      },
      newMinter: {
        address: '',
        amount: 0,
      },
      userAddress: '0x77598660059c39924d068940B26E9F3fc373261A',
      name: '',
      symbol: '',
      userbalance: '',
      totalSupply: '',
      minter: '',
      notificationSystem: {
        options: {
          ballon: {
            position: 'topRight'
          },
          info: {
            position: 'topRight'
          },
          success: {
            position: 'topRight'
          },
          warning: {
            position: 'topRight'
          },
          error: {
            position: 'topRight'
          }
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init() {
      const coinbase_key = 'B290B755FC32345BC85AF29FB058057CDCD14853E5E9806CA09832EC559E1FBC'
      const MyContract = generateContract(coinbase_key, this.ContractAddress)
      try {
        [this.name, this.symbol, this.totalSupply, this.minter, this.userbalance] = await Promise.all([
          MyContract.methods.name().call(),
          MyContract.methods.symbol().call(),
          MyContract.methods.totalSupply().call(),
          MyContract.methods.masterMinter().call(),
          MyContract.methods.balanceOf(this.userAddress).call()
        ])
        this.$toast.success('Token details fetched', '', this.notificationSystem.options.success)
      } catch (error) {
        console.log(error)
        this.$toast.error('Error getting token details', '', this.notificationSystem.options.error)
      }
     
    },

    async mintToken() {
      try {
        const coinbase_address = '0x931EC58f47E576AEFf0DE5892A21A3FB965878a2'
        const coinbase_key = '11175CF24A6F7D7DDD36817D1EA22B8B4BA35D44F7954A778D993907FFE9ADE8'
        const MyContract = generateContract(coinbase_key, this.ContractAddress)
        const minter = await MyContract.methods.mint(this.mint.to, this.mint.amount).send({from: coinbase_address, useGSN: true})
        console.log(minter)
        if(minter){
          this.$toast.success('Token has been minted', '', this.notificationSystem.options.success)
          this.amount = 0
        }
        this.init()
      } catch (error) {
        console.log(error)
        this.$toast.error('could not mint token', '', this.notificationSystem.options.error)
      }
    },

    async transferToken() {
      try {
        const coinbase_address = '0x8BBc49E86AC2FcE6365c8c3848F34912F551663e'
        const coinbase_key = 'A73A134F2F785998C4487B67844238250EC96568479181A4FD6E9843A6D19547'
        const MyContract = generateContract(coinbase_key, this.ContractAddress)
        const transfer = await MyContract.methods.transfer(this.transfer.to, this.transfer.amount).send({from: coinbase_address, useGSN: true})
        console.log(transfer)
        if(transfer){
          this.$toast.success('Token has been transfered', '', this.notificationSystem.options.success)
        }
        this.init()
      } catch (error) {
        console.log(error)
        this.$toast.error('could not transfer token', '', this.notificationSystem.options.error)
      }
    },

    async setMinter() {
      try {
        const coinbase_address = '0x77598660059c39924d068940B26E9F3fc373261A'
        const coinbase_key = 'B290B755FC32345BC85AF29FB058057CDCD14853E5E9806CA09832EC559E1FBC'
        const MyContract = generateContract(coinbase_key, this.ContractAddress)
        const minter = await MyContract.methods.configureMinter(this.newMinter.address, this.newMinter.amount).send({from: coinbase_address, useGSN: true})
        console.log(minter)
        if(minter){
          this.$toast.success('Token minter has been set', '', this.notificationSystem.options.success)
          this.newMinter = {
            address: '',
            amount: 0,
          }
        }
      } catch (error) {
        console.log(error)
        this.$toast.error('could not set token minter', '', this.notificationSystem.options.error)
      }
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
