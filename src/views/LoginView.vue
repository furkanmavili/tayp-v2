<template>
  <div class="flex flex-col justify-center items-center h-full max-w-xxs mx-auto">
    <form @submit.prevent="" class="w-full">
      <div>
        <label class="block mb-2" for="email">Email</label>
        <input class="input" id="email" type="email" />
      </div>
      <div class="mt-6">
        <label class="block mb-2" for="password">Password</label>
        <input class="input" id="password" type="password" />
      </div>
      <button class="button-primary w-full mt-6">Login</button>
    </form>
    <div class="my-4">or</div>
    <button
      class="button flex items-center gap-1 hover:ring-0 focus:ring-0 hover:bg-slate-900/10 dark:hover:bg-slate-100/10 focus:bg-slate-900/10 dark:focus:bg-slate-100/10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 stroke-current block"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
      </svg>
      Sign in with Google
    </button>
  </div>
</template>

<style></style>
