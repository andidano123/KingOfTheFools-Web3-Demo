<script>
import Web3 from "web3";
import { CONSTANT } from "./constant.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      address: "",
      balance: 0,
      connected: false,
      kingAddr: "",
      kingBalance: 0,
      amount: 0.001,
      isKing: false,
    };
  },
  mounted() {},
  methods: {
    /**
     * connecting the wallet, for example using metamask
     */
    async connect() {
      if (window.ethereum != undefined) {
        var acc = await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            const www3 = new Web3(window.ethereum);
            window.web3 = www3;
            return result[0];
          });
        this.address = acc;
        const netId = await this.getChainID();
        console.log(netId);
        if (netId != 4) {
          alert("Wrong network, please switch to Rinkeby Test Network");
          return;
        }
        this.connected = true;
        this.balance = await this.getBalance();
        this.refresh();
      } else {
        alert("Please open this in Chrome with MetaMask");
        return false;
      }
    },
    /**
     * getting chain id of current connected network
     */
    async getChainID() {
      try {
        const netId = await window.web3.eth.getChainId();
        return netId;
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
    /**
     * getting eth balance of current connected address
     */
    async getBalance() {
      try {
        const balance = await window.web3.eth.getBalance(this.address);
        return balance / 1000000000000000000;
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
    /**
     * getting the king information from smart contract and refresh king infos on this page
     */
    async refresh() {
      if (!this.connected) {
        alert("Please connect wallet first");
        return;
      }
      try {
        const token_contract = new window.web3.eth.Contract(
          CONSTANT.abi,
          CONSTANT.contract_address
        );
        this.kingAddr = await token_contract.methods.getKing().call();
        this.kingBalance =
          (await token_contract.methods.getKingBalance().call()) /
          1000000000000000000;
      } catch (error) {
        console.log(error);
        return "error";
      }
      if (this.address.toLowerCase() == this.kingAddr.toLowerCase())
        this.isKing = true;
      else this.isKing = false;
    },
    /**
     * call deposit function of the smart contract
     */
    async deposit() {
      if (!this.connected) {
        alert("Please connect wallet first");
        return;
      }
      try {
        const token_contract = new window.web3.eth.Contract(
          CONSTANT.abi,
          CONSTANT.contract_address
        );
        const gasPrice = await window.web3.eth.getGasPrice();
        token_contract.methods.deposit().send(
          {
            from: this.address,
            value: this.amount * 1000000000000000000,
            gasPrice: gasPrice,
            gas: 100000,
          },
          function () {}
        );
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
  },
};
</script>

<template>
  <div class="parent">
    <h1>Simple Front End for "King of the fools" Smart Contract</h1>
    <h2 v-if="connected && isKing">Welcome, King!</h2>
    <button @click="connect" v-if="!connected" class="btn">
      Connect Wallet
    </button>
    <div v-if="connected" class="line">Connected Successfully</div>
    <div class="line">My Address: {{ address }}</div>
    <div class="line">My Ether: {{ balance }} ETH</div>
    <br />
    <h3>King's Information</h3>
    <div class="line">king address: {{ kingAddr }}</div>
    <div class="line">king balance: {{ kingBalance }} ETH</div>
    <button @click="refresh" class="btn">Refresh</button>
    <br />
    <h3>Deposit</h3>
    <div class="line">amount:<input type="number" v-model="amount" /> ETH</div>
    <button @click="deposit" class="btn">Deposit</button>
  </div>
</template>

<style scoped>
.parent {
  width: 100%;
  height: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;
  padding: 20px;
}
.btn {
  margin-top: 20px;
  border-radius: 5px;
  height: 40px;
  width: 100px;
}
@media (min-width: 750px) {
  .content {
    width: 500px;
  }
}
.line {
  margin-top: 10px;
}
</style>
