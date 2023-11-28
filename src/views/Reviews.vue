<script setup>
import { ref, computed } from "vue";
import Review from "@/components/Review.vue";
import axios from "axios";
import { io } from "socket.io-client";
import Popup from "@/components/addReviewPopup.vue";

const data = ref(null);
const socket = io(
  process.env.VUE_APP_SOCKET_URL || import.meta.env.VITE_SOCKET_URL,
);
const dataExists = ref(true);
const ip = ref(0);
socket.on("connect", () => {
  socket.emit("getData");
  socket.on("takeData", async (comments) => {
    ip.value = (await axios.get("https://api.ipify.org/?format=json")).data.ip;
    data.value = comments;
    dataExists.value = data.value !== null;
  });
});

const popupActive = ref(false);
const popupView = computed(() => (popupActive.value ? Popup : ""));
const popupToggle = () => (popupActive.value = !popupActive.value);

</script>

<template>
  <Transition name="fade">
    <component :is="popupView" :toggleFunc="popupToggle"></component>
  </Transition>
  <div class="frame">
    <div class="page-title">
      <a href="/">
        <button class="page-title__button">
          <font-awesome-icon icon="arrow-left" class="page-title__icon fa-lg" />
        </button>
      </a>
      <header class="page-title__header">Недавние отзывы</header>
      <div class="page-title__cont">
        <button
          class="page-title__button page-title__add-review"
          @click="popupToggle"
        >
          <font-awesome-icon icon="plus" class="page-title__icon fa-lg" />
        </button>
      </div>
    </div>
    <div class="reviews-cont" ref="reviews">
      <div v-if="!dataExists" class="no-reviews">Отзывов пока нет</div>
      <Review
        v-for="review in data"
        :ip="ip"
        :data="review"
      />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.spin {
  margin-top: 3rem;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.frame {
  width: 40rem;
  margin: auto;
  min-width: 20rem;
  margin-top: 5rem;
}
.no-reviews {
  color: #c7c7c7;
}
.page-title__add-review {
  position: absolute;
  right: 0;
}
.page-title__cont {
  position: relative;
  width: 100%;
  height: 2.5rem;
}
.page-title {
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.page-title__header {
  font-size: 2rem;
  width: 60rem;
}
.page-title__button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 2.5rem;
  background-color: #f8f8f2;
  cursor: pointer;
}
.page-title__icon {
  color: #282a36;
}
.reviews-cont {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
.reviews-cont:last-child {
  margin-bottom: 10rem;
}
@media only screen and (max-width: 560px) {
  .page-title__header {
    font-size: 1.4rem;
  }
  .frame {
    width: 90%;
  }
}
</style>
