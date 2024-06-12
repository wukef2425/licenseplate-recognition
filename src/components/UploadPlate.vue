<template>
    <div>
      <input type="file" @change="handleFileUpload" />
      <button @click="submitPlate">Submit</button>
    </div>
  </template>
  
  <script>
  import api from '@/api';
  
  export default {
    data() {
      return {
        file: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      async submitPlate() {
        const formData = new FormData();
        formData.append('pics', this.file);
        const data = await api.getPlateData(formData);
        console.log('Response from backend:', data);
      },
    },
  };
  </script>