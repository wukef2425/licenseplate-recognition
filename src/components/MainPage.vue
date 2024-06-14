<template>
    <div class="fullscreen-div">
        <img src="@/assets/background.png" alt="A Fullscreen Image">
    </div>
    <button class="button" @click="enter">
        Enter
        <svg fill="currentColor" viewBox="0 0 24 24" class="icon">
            <path clip-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fill-rule="evenodd"></path>
        </svg>
    </button>
</template>


<script>
export default {
    name: 'MainPage',
    methods: {
        enter() {
            console.log(111)
            this.$router.push({
                    name: "UploadPlate",
                },
            )
        },
    },
};
</script>

<style scoped>
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
.button {
    position: relative;
    margin-top: 80vh;
    margin-left: 75vh;
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


.button:hover {
    transform: scale(1.05);
    border-color: #fff9;
}

.button:hover .icon {
    transform: translate(4px);
}

.button:hover::before {
    animation: shine 1.5s ease-out infinite;
}

.button::before {
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

