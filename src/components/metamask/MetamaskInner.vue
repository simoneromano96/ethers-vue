<template>
  <h1>Inner</h1>
  <button @click="getBlockNumber">Get last block number [Current: {{ blockNumber }}]</button>
  <button @click="getAddress">Get account address [Current: {{ address }}]</button>
  <button @click="getBalance">Get account balance [Current: {{ balance }}]</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { initMetamask } from "../..";

const { provider, signer } = await initMetamask();
console.log("🚀 ~ file: MetamaskInner.vue ~ line 11 ~ provider, signer", provider, signer)

// const accounts = await provider.send("eth_accounts", []);
const accounts = await provider.send("eth_requestAccounts", []);
console.log("🚀 ~ file: MetamaskInner.vue ~ line 18 ~ accounts", accounts)

const blockNumber = ref(0)
const getBlockNumber = async () => {
  const lastBlockNumber = await provider.getBlockNumber();
  blockNumber.value = lastBlockNumber;
}

const address = ref("");
const getAddress = async () => {
  const currentAddress = await signer.getAddress();
  address.value = currentAddress;
}

const balance = ref(0)
const getBalance = async () => {
  const lastBalance = await signer.getBalance();
  balance.value = lastBalance;
}
</script>
