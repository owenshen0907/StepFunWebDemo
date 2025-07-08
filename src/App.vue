<template>
  <NavBar @open-env="showEnv = true" />
  <EnvModal :show="showEnv" @close="showEnv = false" />
  <main class="pt-16">
    <router-view />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import NavBar  from '@/components/NavBar.vue'
import EnvModal from '@/components/EnvModal.vue'

const showEnv = ref(false)
</script>