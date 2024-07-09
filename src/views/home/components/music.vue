<template>
  <div>music</div>
  <audio ref="audioRef" controls volumechange style="width: 100%">
    <source :src="audioSource" type="audio/flac" />
  </audio>
  <button @click="playAudio">播放</button>
  <button @click="pauseAudio">暂停</button>
</template>

<script setup>
import { ref } from "vue";
import audioFile from "@/assets/music/陈奕迅 - 倾城.flac"; // 导入音频文件

const audioRef = ref(null); // 创建一个 ref 引用

const audioSource = audioFile; // 音频文件路径

const playAudio = () => {
  console.log(audioRef.value);

  audioRef.value.play();
};

const pauseAudio = () => {
  audioRef.value.pause();
};
</script>

<style scoped></style>
