<template>
<h1>Outer</h1>
<suspense>
  <metamask-inner />
</suspense>
</template>

<script setup lang="ts">
import MetamaskInner from "./MetamaskInner.vue";
</script>
