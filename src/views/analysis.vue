<template>
  <input type="file" @change="readExel" />
  <br />
  아버지 키를 입력해주세요 <input type="number" id="key" />
  <button @click="bun">분석시작</button>
  <div id="son_key"></div>
</template>

<script>
/* eslint-disable */
export default {
  name: "app",
  data() {
    return {
      father: [],
      son: [],
    };
  },
  methods: {
    async readExel(event) {
      console.log(event);
      let input = event.target;
      let line = [],
        line2 = [];
      let reader = new FileReader();
      reader.onload = function () {
        let data = reader.result;
        let workBook = XLSX.read(data, { type: "binary" });
        const x = workBook.Sheets.train;

        for (let j = 2; j < 757; j++) {
          line.push(x["A" + j].v);
          line2.push(x["B" + j].v);
        }
      };
      this.father = line;
      this.son = line2;

      reader.readAsBinaryString(input.files[0]);
    },

    bun() {
      console.log(this.father);
      console.log(this.son);
      let key = document.getElementById("key");
      let son_key = document.getElementById("son_key");
      let kv = Number(key.value);
      let xt = tf.tensor(this.father);
      let yt = tf.tensor(this.son);
      console.log(xt);
      let X = tf.input({ shape: [1] });
      let Y = tf.layers.dense({ units: 1 }).apply(X);
      let model = tf.model({ inputs: X, outputs: Y });
      tfvis.show.modelSummary({ name: "Model Summary" }, model);
      let compileParam = {
        optimizer: tf.train.adam(), // train ??
        loss: tf.losses.meanSquaredError,
      }; // 최적화의 loss 측정방법종류
      model.compile(compileParam);
      model.summary();
      const fitParm = {
        epochs: 100,
        callbacks: tfvis.show.fitCallbacks(
          { name: "Training Performance" },
          ["loss", "mse"],
          { height: 200, callbacks: ["onEpochEnd"] }
        ),
      };
      const my = tf.tensor([kv]);
      model.fit(xt, yt, fitParm).then((_) => {
        (async function () {
          let result = model.predict(my);
          const real_result = await result.arraySync(); // 텐서를 다시 배열로 만듬
          son_key.textContent = `아들의 예상키는 ${Math.floor(
            real_result
          )}cm입니다.`;
        })();
      });
    },
  },
};
</script>

<style></style>
