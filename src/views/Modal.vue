<template>
    <div v-if="isVisible" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <img :src="photoSrc" alt="Maximized Photo" class="modal-img"/>
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
      closeModal() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1050; /* Higher value to ensure it's above other content */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.75); /* Slightly less opaque for better visibility */
  }
  
  .modal-content {
    position: relative;
    padding: 0;
    border-radius: 8px; /* Rounded corners for a softer look */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
    background-color: #fff; /* White background for contrast */
  }
  
  .close {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #333; /* Darker color for the close button */
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s; /* Smooth transition for color change */
  }
  
  .close:hover {
    color: #f00; /* Red color on hover for visibility */
  }
  
  .modal-img {
    display: block;
    width: 100%;
    max-width: 80vw; /* Responsive width */
    height: auto;
    margin: auto; /* Center the image within the modal */
    border-radius: 8px 8px 0 0; /* Rounded corners on the top */
  }
  </style>
  