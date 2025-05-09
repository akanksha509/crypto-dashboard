<script setup>
const year   = new Date().getFullYear()
const author = 'Akanksha Thakur'
</script>

<template>
  <footer class="py-4 text-center text-xs text-gray-500">
    <div class="flex justify-center space-x-4 mb-2">
      <a
        href="https://github.com/akanksha509"
        target="_blank"
        class="text-gray-400 hover:text-gray-600"
        aria-label="GitHub"
      >
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12.02c0 4.43 2.87 8.19 6.86 9.5.5.09.68-.22.68-.48
               0-.24-.01-.87-.01-1.71-2.79.61-3.38-1.35-3.38-1.35-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.63.07-.63
               1 .07 1.53 1.03 1.53 1.03.89 1.54 2.34 1.09 2.91.83.09-.65.34-1.09.62-1.34-2.22-.25-4.56-1.13-4.56-4.95
               0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.85c.85 0
               1.71.12 2.5.34 1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69
               0 3.84-2.34 4.71-4.57 4.96.36.31.68.94.68 1.89 0 1.37-.01 2.46-.01 2.79 0 .27.18.58.69.48A10.02
               10.02 0 0022 12.02C22 6.48 17.52 2 12 2z"
          />
        </svg>
      </a>
    </div>

    <p>&copy; {{ year }} | {{ author }}</p>
  </footer>
</template>
