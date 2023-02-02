<template>
  <h1>Image Upload</h1>
  <div class="container">
    <div class="main">
      <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
        <input
          type="file"
          multiple
          name="file"
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="file"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <label for="fileInput" class="file-label">
          <div v-if="isDragging">사진 파일을 이곳에 놓아주세요.</div>
          <div v-else>Drop files here or <u>click here</u> to upload.</div>
        </label>

        <div class="preview-container mt-4" v-if="files.length">
          <div v-for="file in files" :key="file.name" class="preview-card">
            <div class="img_c">
              <img id="preview-img" :src="generateURL(file)" />
              <p>
                {{ file.name }}
              </p>
              <button
                class="w-btn-red w-btn"
                type="button"
                @click="remove(files.indexOf(file))"
                title="Remove file"
              >
                ×
              </button>

              <button class="w-btn-green w-btn" @click="send()">DB저장</button>
              <button class="w-btn-green2 w-btn" @click="A">분석</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="analysis">{{ analysis }}</div>
  </div>
</template>

<script>
/* eslint-disable */

import axios from "axios";

export default {
  data() {
    return {
      isDragging: false,
      files: [],
      filesPreview: [],
      uploadImageIndex: 0,
      analysis: "",
      url: "",
      url_data: "",
    };
  },

  methods: {
    /*axios*/
    send: function () {
      axios({
        url: "/about",
        method: "post", // 전송방식을 post로 지정
        data: { name: this.url_data },
      }).then((res) => {
        console.log("ok", res);
        alert(res.data.message);
      });
    },

    onChange() {
      this.files = [...this.$refs.file.files];
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
      this.isDragging = false;
    },
    generateURL(file) {
      const fileSrc = URL.createObjectURL(file);
      fetch(fileSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64data = reader.result;
            this.url_data = base64data;
            console.log(this.url_data);
          };
          reader.readAsDataURL(blob);
        });
      // setTimeout(() => {
      //   URL.revokeObjectURL(fileSrc);
      // }, 1000);
      return fileSrc;
    },
    remove(i) {
      this.files.splice(i, 1);
    },

    A() {
      /*mobilenet*/
      mobilenet.load().then((model) => {
        const image = document.getElementById("preview-img");
        // Classify the image.
        model.classify(image).then((predictions) => {
          console.log(predictions);
          this.analysis = `예상 이름 : ${predictions[0].className},
              확률 : ${(predictions[0].probability * 100).toFixed(2)}%`;
        });
      });

      /*base64*/
      // fetch(this.url)
      //   .then((res) => res.blob())
      //   .then((blob) => {
      //     const reader = new FileReader();
      //     reader.onload = () => {
      //       const base64data = reader.result;
      //       this.url_data = base64data;
      //       console.log(this.url_data);
      //     };
      //     reader.readAsDataURL(blob);
      //   });

      //   axios({
      //     url: "/about",
      //     method: "post", // 전송방식을 post로 지정
      //     data: { name: this.url },
      //   }).then((res) => {
      //     console.log("ok", res);
      //     alert(res.data.message);
      //   });
    },
  },
};
</script>

<style>
.main {
  display: flex;
  flex-grow: 1;
  align-items: center;
  height: 500px;
  justify-content: center;
  text-align: center;
}

.dropzone-container {
  margin-bottom: 300px;
  padding: 4rem;
  background: #d3ffd3;
  /* border: 1px solid #e2e8f0; */
}

.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
}

.preview-container {
  display: flex;
  margin-top: 2rem;
}

.preview-card {
  display: flex;
  padding: 5px;
  margin-left: 5px;
}

#preview-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 3px double #a2a2a2;
  background-color: #a2a2a2;
}

.img_c {
  display: flex;
}

/*버튼 CSS*/

button {
  margin: 20px;
}

.w-btn {
  position: relative;
  border: none;
  display: inline-block;
  padding: 15px 30px;
  border-radius: 15px;
  font-family: "paybooc-Light", sans-serif;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}

.w-btn-outline {
  position: relative;
  padding: 15px 30px;
  border-radius: 15px;
  font-family: "paybooc-Light", sans-serif;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}

.w-btn-green {
  background-color: #77af9c;
  color: #d7fff1;
}

.w-btn-green2 {
  background-color: #519d9e;
  color: #9dc8c8;
}

.w-btn-green-outline {
  border: 3px solid #77af9c;
  color: darkgray;
}

.w-btn-green2-outline {
  border: 3px solid #519d9e;
  color: darkgray;
}

.w-btn-green:hover {
  background-color: #77af9c;
  color: #d7fff1;
}

.w-btn-green2:hover {
  background-color: #519d9e;
  color: #9dc8c8;
}

.w-btn-red {
  background-color: #ff5f2e;
  color: #e1eef6;
}

.w-btn-red-outline {
  border: 3px solid #ff5f2e;
  color: #6e6e6e;
}

.w-btn-red:hover {
  background-color: #ff5f2e;
  color: #e1eef6;
}

/*analysis CSS*/
.analysis {
}
</style>
