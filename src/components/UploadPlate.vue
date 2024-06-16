<template>
    <div class="fullscreen-div" v-if="!this.is_show">
        <img src="@/assets/background.jpg" alt="A Fullscreen Image">
    </div>
    <button class="enter_button" @click="enter" v-if="!this.is_show">
        Enter
        <svg fill="currentColor" viewBox="0 0 24 24" class="icon">
            <path clip-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fill-rule="evenodd"></path>
        </svg>
    </button>
    <div v-if="this.is_show">
        <!-- 顶部栏 -->
        <div class="header">
            <div class="header-content">
                <div class="header-title">PLATE RECOGNIZER</div>
            </div>
        </div>

        <div class="container">
            <div v-if="uploadedImageUrl" class="result-section">
                <div class="result-image">
                    <img :src="uploadedImageUrl" alt="Uploaded Image"/>
                </div>
                <div v-if="resultData.truckNo" class="result-info">
                    <el-card>
                        <p><strong>License Plate:</strong> {{ resultData.truckNo || '未识别到车牌' }}</p>
                        <p v-if="resultData.coordinate">
                            <strong>Coordinate:</strong> Xmax: {{ resultData.coordinate.xmax }}, Xmin:
                            {{ resultData.coordinate.xmin }}, Ymax: {{ resultData.coordinate.ymax }}, Ymin:
                            {{ resultData.coordinate.ymin }}
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
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import api from '@/api';

export default {
    setup() {
        const is_show = ref(false);
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
        function enter() {
            is_show.value = true; // 设置 is_show 属性
        }
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
                    } else {
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
            is_show,
            fileList,
            uploadedImageUrl,
            resultData,
            enter,
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

.fullscreen-div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; /* 视口宽度 */
    height: 100vh; /* 视口高度 */
    z-index: -999; /* 确保div不会遮挡页面上的其他元素 */
    overflow: hidden;
}

.fullscreen-div img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保证图片覆盖整个div且不变形 */
}
.enter_button {
    position: relative;
    margin-top: 60vh;
    margin-left: 80vh;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    padding-block: 1rem; /* 增加内边距高度 */
    padding-inline: 2.5rem; /* 增加内边距宽度 */
    background-color: rgb(0 107 179);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffff;
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 25px; /* 增加字体大小 */
}

.icon {
    width: 32px; /* 增加图标宽度 */
    height: 32px; /* 增加图标高度 */
    transition: all 0.3s ease-in-out;
}


.enter_button:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.enter_button:hover .icon {
    transform: translate(4px);
}

.enter_button:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.enter_button::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%
    );
    top: 0;
    left: -100px;
    opacity: 0.6;
}

@keyframes shine {
    0% {
        left: -100px;
    }

    60% {
        left: 100%;
    }

    to {
        left: 100%;
    }
}

</style>