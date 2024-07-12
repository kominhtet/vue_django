<!-- Modal.vue -->
<template>
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-content">
        <img :src="photoSrc" alt="Fact Check Photo" />
        <button @click="close">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      photoSrc: {
        type: String,
        required: true
      }
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  .modal-content img {
    max-width: 100%;
    height: auto;
  }
  </style>
  