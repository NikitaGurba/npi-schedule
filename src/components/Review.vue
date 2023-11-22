<script setup>
import { ref } from "vue";
import Grade from "@/components/Grade.vue";
import { io } from "socket.io-client";
import axios from "axios";
const props = defineProps({
  data: Object,
  visitorId: String
});

const socket = io(
  process.env.VUE_APP_SOCKET_URL || import.meta.env.VITE_SOCKET_URL,
);
const { name, grade, text, lecturer, _id } = props.data;
const likes = ref(props.data.likes);
const dislikes = ref(props.data.dislikes);
const liked = ref(false);
const disliked = ref(false);
let ip
const checkRate = async () => {
    ip = (await axios.get('https://api.ipify.org/?format=json')).data.ip;
    likes.value.map((item) => {
      if (item === ip) {
        liked.value = true;
      }
    });
    dislikes.value.map((item) => {
      if (item === ip) {
        disliked.value = true;
      }
    });
};
checkRate();
const date = new Date(props.data.date).toLocaleDateString("ru-RU");
  
const like = () => {
  socket.emit("like", _id, ip);
  socket.on("takeLikes", (likesList) => {
    likes.value = likesList;
    liked.value = !liked.value;
    socket.off();
    if (disliked.value) {
      socket.emit("dislike", _id, ip);
      socket.on("takeDislikes", (dislikeList) => {
        dislikes.value = dislikeList;
        disliked.value = !disliked.value;
        socket.off();
      });
    }
  });
};
const dislike = () => {
  socket.emit("dislike", _id, ip);
  socket.on("takeDislikes", (dislikeList) => {
    dislikes.value = dislikeList;
    disliked.value = !disliked.value;
    socket.off();
    if (liked.value) {
      socket.emit("like", _id, ip);
      socket.on("takeLikes", (likesList) => {
        likes.value = likesList;
        liked.value = !liked.value;
        socket.off();
      });
    }
  });
};
</script>

<template>
  <article class="review">
    <header class="head">
      <router-link
        v-if="lecturer"
        :to="`/reviews/${lecturer}`"
        class="head__lecturer"
      >
        {{ lecturer }}
      </router-link>
      <span>{{ date }}</span>
    </header>
    <main class="content">
      <div class="content-info">
        <div class="content-info__name">
          <b>{{ name }}</b>
        </div>
        <div class="content-info__grade">
          <Grade :grade="grade"></Grade>
        </div>
      </div>
      <span class="content__text">{{ text }}</span>
      <div class="rate">
        <div class="rate__cont">
          <button
            class="rate__button rate__like"
            @click="like"
            :style="{ background: liked ? '#ff5555' : '#1e2029' }"
          >
            <font-awesome-icon icon="thumbs-up" class="fa-1x" />
          </button>
          <span>{{ likes.length }}</span>
        </div>
        <span class="rate__sep">|</span>
        <div class="rate__cont">
          <button
            class="rate__button rate__dislike"
            @click="dislike"
            :style="{ background: disliked ? '#ff5555' : '#1e2029' }"
          >
            <font-awesome-icon icon="thumbs-down" class="fa-1x" />
          </button>
          <span>{{ dislikes.length }}</span>
        </div>
      </div>
    </main>
  </article>
</template>

<style scoped>
.review {
  background-color: #282a36;
  border-radius: 0.5rem;
  padding: 1rem;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.rate__button {
  padding: 0.5rem;
  border-radius: 2rem;
  border: 0.1rem solid #9ea2b9;
  border: none;
  width: 2.2rem;
  height: 2.2rem;
  background-color: #1e2029;
  cursor: pointer;
}
.rate {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.rate__sep {
  color: #4b4e60;
}
.rate__cont {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.content-info {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.head__lecturer {
  color: #8093ca;
  text-decoration: none;
}
.head__lecturer {
  width: fit-content;
}
.head {
  position: relative;
}
.head span {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
