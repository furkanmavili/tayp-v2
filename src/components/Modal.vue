<template>
  <transition name="fade">
    <div class="fixed inset-0 z-20" v-if="show">
      <div class="modal__backdrop overflow-x-hidden overflow-y-auto" @click="closeModal()" />

      <div
        class="p-8 shadow-md max-w-xl bg-gray-200 dark:bg-gray-850 flex flex-col rounded-md z-10 mx-10 md:mx-auto my-20 relative"
      >
        <div class="flex justify-between items-start">
          <slot name="header" />
        </div>

        <div class="mt-4">
          <slot name="body" />
        </div>

        <div class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    closeModal() {
      this.show = false;
      document.querySelector("body").classList.remove("overflow-hidden");
    },
    openModal() {
      this.show = true;
      document.querySelector("body").classList.add("overflow-hidden");
    },
  },
};
</script>

<style scoped>
.modal__backdrop {
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
