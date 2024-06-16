<template>
  <div>
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-content">
        <div class="header-title">PLATE RECOGNIZER</div>
      </div>
    </div>

    <div class="container">
      <div v-if="uploadedImageUrl" class="result-section">
        <div class="result-image">
          <img :src="uploadedImageUrl" alt="Uploaded Image" />
        </div>
        <div v-if="resultData.truckNo" class="result-info">
          <el-card>
            <p><strong>License Plate:</strong> {{ resultData.truckNo || '未识别到车牌' }}</p>
            <p v-if="resultData.coordinate">
              <strong>Coordinate:</strong> Xmax: {{ resultData.coordinate.xmax }}, Xmin: {{ resultData.coordinate.xmin }}, Ymax: {{ resultData.coordinate.ymax }}, Ymin: {{ resultData.coordinate.ymin }}
            </p>
            <p v-else>
              <strong>Coordinate:</strong> 未识别到坐标
            </p>
            <p><strong>Recognition Time:</strong> {{ resultData.recTime || 'N/A' }}</p>
          </el-card>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';

export default {
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
      fileList.value = [file];
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
      if (fileList.value.length > 0) {
        const formData = new FormData();
        formData.append('pics', fileList.value[0].raw);
        formData.append('from', 0);
        formData.append('color', 'yellow');
        ElMessage.info('文件上传中...');
        try {
          const response = await api.getPlateData(formData);
          // 使用 response?.data || {} 确保 data 有默认值以防止解构未定义对象
          const data = response?.data || {};

          uploadedImageUrl.value = URL.createObjectURL(fileList.value[0].raw);

          if (data.truckNo && data.coordinate) {
            resultData.value = data;
          } else {
            resultData.value = {
              truckNo: '',
              coordinate: null,
              recTime: '',
            };
          }

          if (response) {
            ElMessage.success('识别结果已接收！');
          }
          else {
            ElMessage.error('识别失败');
          }

          console.log('Response from backend:', data);
        } catch (error) {
          ElMessage.error('识别结果接收失败，请重试');
          console.error('上传过程中发生错误:', error);
        }
      } else {
        ElMessage.warning('请先上传文件');
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
}

.header-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.header-title {
  font-size: 1.5em;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.result-section {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.result-image img {
  max-width: 100%;
  height: auto;
}

.result-info {
  margin-top: 10px;
  width: 100%;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-demo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  color: #8c939d;
  width: 360px;
  margin-bottom: 10px;
}
</style>