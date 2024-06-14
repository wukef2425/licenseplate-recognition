<template>
  <div>
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-content">
        <div class="header-title">PLATE RECOGNIZER</div>
        <!-- <el-button type="primary" class="header-button">Contact</el-button> -->
      </div>
    </div>

    <div class="container">
      <div class="upload-section">
        <el-upload
          class="upload-demo"
          drag
          :on-change="handleFileUpload"
          :file-list="fileList"
          :on-remove="handleRemove"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button type="primary" @click="submitPlate">Submit</el-button>
      </div>

      <div v-if="uploadedImageUrl" class="result-section">
        <div class="result-image">
          <img :src="uploadedImageUrl" alt="Uploaded Image" />
        </div>
        <div class="result-info">
          <p><strong>License Plate:</strong> {{ resultData.truckNo }}</p>
          <p><strong>Coordinate:</strong> Xmax: {{ resultData.coordinate.xmax }}, Xmin: {{ resultData.coordinate.xmin }}, Ymax: {{ resultData.coordinate.ymax }}, Ymin: {{ resultData.coordinate.ymin }}</p>
          <p><strong>Recognition Time:</strong> {{ resultData.recTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';

export default {
    name: 'UploadPlate',
  setup() {
    const fileList = ref([]);
    const uploadedImageUrl = ref(null);
    const resultData = ref({
      truckNo: '',
      coordinate: {
        xmax: '',
        xmin: '',
        ymax: '',
        ymin: '',
      },
      recTime: '',
    });

    const handleFileUpload = (file) => {
      // 将新文件追加到现有文件列表中
      fileList.value.push(file);
      console.log('File uploaded:', file);
    };

    const handleRemove = () => {
      fileList.value = [];
      uploadedImageUrl.value = null;
      resultData.value = {
        truckNo: '',
        coordinate: {
          xmax: '',
          xmin: '',
          ymax: '',
          ymin: '',
        },
        recTime: '',
      };
    };

    const submitPlate = async () => {
      console.log('FileList:', fileList.value);
      if (fileList.value.length === 0) {
        ElMessage.warning('请先上传文件');
        return;
      }

      const formData = new FormData();
      formData.append('pics', fileList.value[0].raw);

      ElMessage.info('文件上传中...');
      try {
        const { data } = await api.getPlateData(formData);
        uploadedImageUrl.value = URL.createObjectURL(fileList.value[0].raw);
        resultData.value = data;
        ElMessage.success('识别结果已接收！');
        console.log('Response from backend:', data);
      } catch (error) {
        ElMessage.error('识别结果接收失败，请重试');
        console.error('上传过程中发生错误:', error);
      }
    };

    return {
      fileList,
      uploadedImageUrl,
      resultData,
      handleFileUpload,
      handleRemove,
      submitPlate,
    };
  },
};
</script>

<style scoped>
.header {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.header-title {
  font-size: 1.5em;
  margin-left: 20px;
}

.header-button {
  margin-right: 20px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
}

.upload-section {
  margin-right: 20px;
}

.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-image img {
  max-width: 100%;
  height: auto;
}

.result-info {
  margin-top: 20px;
  text-align: left;
}

.upload-demo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  color: #8c939d;
  width: 360px;
  margin: 0 auto;
}
</style>