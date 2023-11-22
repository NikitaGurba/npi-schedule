<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import HeaderFull from "@/components/HeaderFull.vue";
import { defineAsyncComponent, ref, onMounted } from "vue";
const Search = defineAsyncComponent(() => import("@/components/Search.vue"));
const Table = defineAsyncComponent(() => import("@/components/Table.vue"));
let lastUrl,
  lastName = "";
if ((lastUrl = localStorage.getItem("url"))) {
  lastUrl = localStorage.getItem("url").split(",")[0];
  lastName = localStorage.getItem("url").split(",")[1];
}

let footer = ref(null); //$('footer').outerHeight();
onMounted(() => {
  let didScroll;
  let lastScrollTop = 0;
  let delta = 5;
  let footerHeight = footer.value.offsetHeight
  window.addEventListener("scroll", function (event) {
    didScroll = true;
  });

  setInterval(function () {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    let st = window.scrollY;
    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > footerHeight) {
      // Scroll Down
      footer.value.classList.remove("footer-down")
    } else {
      // Scroll Up
      if (st < document.body.scrollHeight) {
        footer.value.classList.add("footer-down");
      }
    }

    lastScrollTop = st;
  }
});
</script>

<template>
  <HeaderFull />
  <Search class="search-cont" />
  <div class="last-visited" v-if="lastName != ''">
    Последнее просмотренное:
    <a :href="lastUrl" v-if="lastName">{{ lastName }}</a>
    <a :href="lastUrl" v-else>Ссылка</a>
  </div>
  <Table></Table>
  <div class="footer footer-down" ref="footer">
    <div class="footer__cont">
      <font-awesome-icon class="footer__info-icon fa-2x" icon="circle-info" />
      <div class="footer__info-text">
        <span>Нашли баг? Возник вопрос? </span>
        <a href="https://vk.com/redmaunn">Пишите мне</a>
        <a class="linkToGit" href="https://github.com/RedMaun/npi-schedule">
          Исходный код
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #f8f8f2;
}
.linkToGit {
  display: block;
  width: fit-content;
}
#one,
#two {
  color: #282a36;
}

.last-visited {
  width: fit-content;
  margin: auto;
  margin-top: 2rem;
}

.search-cont {
  margin-top: 10rem;
}
.message {
  width: fit-content;
  margin: auto;
  margin-top: 6rem;
  background-color: #ff5555;
  padding: 1rem;
  border-radius: 1rem;
}
.footer {
  width: 100%;
  padding: 0.7rem;
  background-color: #2b2f3a;
  position: fixed;
  bottom: 0rem;
  transition: bottom 0.2s ease-in-out;
}

.footer-down
{
  bottom: -4rem;
}

.footer__cont {
  width: fit-content;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.table-cont {
  width: 30rem;
  border-spacing: 0;
  border-radius: 0.8rem;
  margin: auto;
  margin-top: 4rem;
  margin-bottom: 30vh;
}
@media only screen and (max-width: 840px) {
  .table-cont {
    width: 90%;
  }
}
@media only screen and (max-width: 600px) {
  * {
    font-size: small;
  }
}
@media only screen and (max-width: 370px) {
  * {
    font-size: x-small;
  }
  .footer__info-icon {
    font-size: 2rem !important;
  }
  .group {
    border-radius: 0 !important;
    background-color: #656981 !important;
    border: none !important;
  }
  .message {
    width: 80%;
  }
}
</style>
