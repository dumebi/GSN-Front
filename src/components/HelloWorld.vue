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
      <p>{{Number(totalSupply)}}</p>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12">
      <h3>Minter</h3>
      <p>{{minter}}</p>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-6 ">
      <h3>Mint token</h3>
      <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Amount of tokens to mint</label>
        <input v-model="amount" type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter token amount">
      </div>
      <button @click="mint" :disabled="amount < 1" type="button" class="btn btn-primary">Mint</button>
    </form>
    </div>
  </div>
  <!-- <div class="row justify-content-center">
    <div class="col-sm-8 ">
      <h3>Set Minter</h3>
      <form>
      <div class="form-group">
        <label for="exampleInputEmail1">New minter address</label>
        <input v-model="newMinter" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter address">
      </div>
      <button @click="setMinter" :disabled="newMinter < 1" type="button" class="btn btn-primary">Set Minter</button>
    </form>
    </div>
  </div> -->
</div>
</template>

<script>
import {signAndTransact} from '../signAndTransact'
export default {
  name: 'HelloWorld',
  data: function () {
    return {
      amount: 0,
      name: '',
      symbol: '',
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
      console.log(window.MyContract.methods)
      try {
        [this.name, this.symbol, this.totalSupply, this.minter] = await Promise.all([
          window.MyContract.methods.name().call(),
          window.MyContract.methods.symbol().call(),
          window.MyContract.methods.totalSupply().call(),
          window.MyContract.methods.masterMinter().call()
        ])
        
        this.$toast.success('Token details fetched', '', this.notificationSystem.options.success)
      } catch (error) {
        console.log(error)
        this.$toast.error('Error getting token details', '', this.notificationSystem.options.error)
      }
     
    },

    async mint() {
      // console.log(this.amount, this.minter)
      let coinbase = '0x77598660059c39924d068940B26E9F3fc373261A'
      let key = 'B290B755FC32345BC85AF29FB058057CDCD14853E5E9806CA09832EC559E1FBC'
      let ContractAddress = '0x5cb886C32De048CF9EC61014b5232552A63824A5'
      
      try {
        const nonce = await window.web3.eth.getTransactionCount(coinbase, 'latest')
        const details = {
          nonce,
          from: coinbase,
          to: ContractAddress,
          gasPrice: window.web3.utils.toHex(window.web3.utils.toWei('50'.toString(), 'gwei')),
          gasLimit: window.web3.utils.toHex(4700000), // Raise the gas limit to a much higher amount
          data: window.MyContract.methods.mint(this.minter, this.amount).encodeABI(),
        };
        console.log(details)
        const minter = await signAndTransact(window.web3, key, details);
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

    // async setMinter() {
    //   try {
    //     const minter = await window.MyContract.methods.setMinter(this.newMinter).send({
    //         from: '0x77598660059c39924d068940B26E9F3fc373261A',
    //         gas: 2000000
    //     })
    //     if(minter){
    //       this.$toast.success('Token minter has been set', '', this.notificationSystem.options.success)
    //       this.newMinter = ''
    //     }
    //     const minterDetails = await window.MyContract.methods.minter().call()
    //     this.minter = minterDetails
    //   } catch (error) {
    //     this.$toast.error('could not set token minter', '', this.notificationSystem.options.error)
    //   }
     
    // }
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
