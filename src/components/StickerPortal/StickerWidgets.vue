<template>
  <div class="row" style="width:100%;margin:auto">
    <div class="col outer-div-style" style="backgroundColor: #6070E4;backgroundImage: linear-gradient(to right, #6070E4, #805EE4)">
      <div class="row">
        <div class="col-8 column-divs">
                <span class="content-header">
                    Stickers completed
                </span>
        </div>
      </div>

      <div v-if="info !== null && info.data.length !== 0" class="row content">
        {{ info.data[0] }}
      </div>
    </div>

    <div class="col outer-div-style" style="backgroundColor: #12C8EF;backgroundImage: linear-gradient(to right, #12C8EF, #1076EF)">
      <div class="row">
        <div class="col column-divs">
                <span class="content-header">
                    Stickers pending
                </span>
        </div>
      </div>

      <div v-if="info !== null && info.data.length !== 0" class="row content">
        {{ info.data[1] }}
      </div>
    </div>

    <div class="col outer-div-style" style="backgroundColor:#F5385A;backgroundImage: linear-gradient(to right, #F5385A, #F4581C)">
      <div class="row">
        <div class="col column-divs">
                <span class="content-header">
                    Total amount of stickers
                </span>
        </div>
      </div>

      <div v-if="info !== null && info.data.length !== 0" class="row content">
        {{ info.data[2] }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'StickerWidgets',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    Vue.$http
      .get('v1/sticker')
      .then(response => (this.info = response))
  }
}
</script>

<style scoped>
.outer-div-style {
  width: 95%;
  height: 100px;
  border-radius: 5px;
  margin-right: 5px;
  margin-left: 5px
}

.content-header {
  margin-top: 5px;
  font-size: 13px;
  color: white
}

.loading-bar {
  width: 65%;
  height: 3px;
  border-radius: 1px;
  border: 0px;
  overflow: hidden;
  background-color: white;
  margin-top: 6px;
  margin-left: 15px;
}

.percentage {
  display: block;
  height: 100%;
  border: 1px solid transparent;
}

.links {
  color: white;
  font-size: 10px;
  margin-top: 10px;
  margin-left: 15px
}

.links:hover {
  color: lightgray
}

.rectangle {
  width: 25px;
  height: 25px;
  background-color: white;
  border-radius: 3px;
  float: right;
  margin-top: 20px;
}

.column-divs {
  margin-top: 15px;
  padding-right: 5px;
  padding-left: 5px;
}

.dot {
  width: 3px;
  height: 3px;
  background-color: #677EE8;
  border-radius: 50%;
  margin-right: 1px;
  margin-left: 1px;
  margin-top: 44%;
}

.under-title-content {
  font-size: 11px;
  color: white;
}

.verfication-network-image {
  width: 50px;
  border-radius: 50%;
  margin-left: 15px
}

.pr-links {
  font-size: 11px;
  color: white;
  margin-left: 15px
}

.pr-links:hover {
  color: gray
}

.pr-links-row {
  margin-top: 10px
}

.pr-content {
  margin-left: 0px;
  font-size: 11px;
  color: white;
  margin-top: 3px
}

.input-style {
  margin-top: 5px;
  width: 80%;
  border-radius: 2px;
  border: 0px;
  padding: 2px;
}

.date {
  color: white;
  font-size: 13px;
  margin-left: 10px !important;
}

.content {
  margin-left: 0px;
  font-size: 18px;
  color: white;
}

@media (max-width: 1336px) {
  .verfication-network-image {
    width: 30px;
  }
}

@media (max-width: 530px) {
  .outer-div-style {
    flex-basis: 100% !important;
    margin-top: 10px
  }
}
</style>
