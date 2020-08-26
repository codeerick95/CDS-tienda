<template>
  <div class="counter text-center">
    <!-- <button class="btn btn-sm btn-outline-primary">
      <i class="fas fa-minus"></i>
    </button> -->

    <span class="lead mx-2">{{ quantity }}</span>

    <!-- <button class="btn btn-sm btn-outline-primary">
      <i class="fas fa-plus"></i>
    </button> -->
  </div>
</template>

<script>
  export default {
    props: ['quantity']
  }
</script>

<style scoped>

</style>
