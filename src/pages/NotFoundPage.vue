<template>
  <!-- no bootstrap `container` so the image can stretch to 100 % -->
  <section class="notfound-wrapper">
    <img
      src="@/assets/404.jpeg"
      alt="404 – This is not the recipe you're looking for"
      class="notfound-img"
    />

    <a href="/" class="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
          Go Home
        </a>
  </section>
</template>

<style scoped>
.custom-bg {
  background: linear-gradient(to right, #aed1ff, #b1eaff);
}

/* wrapper: centers content vertically a bit and adds breathing space */
.notfound-wrapper {
    background: linear-gradient(90deg, #A8E0D8, #c9dedb);
  text-align: center;
  padding: 0;
  margin: 0;
}

.notfound-img {
  width: 75%;      /* stretch to full viewport width */
  height: 50%;     /* keep the original aspect ratio */
  display: block;   /* removes inline-element whitespace */
  object-fit: cover;/* fills the width even if height is constrained */
  margin: 0 auto; /* centers the image horizontally */
}

.custom-btn:hover {
  background-color: #d2a8ff !important;
  transition: background-color 0.3s ease-in-out;
}

@media (prefers-color-scheme: dark) {
  .custom-bg {
    background: linear-gradient(to right, #1f2937, #111827);
    color: white !important;
  }

  .custom-btn {
    background-color: #374151 !important;
    color: white !important;
  }

  .custom-btn:hover {
    background-color: #4b5563 !important;
  }
}
</style>
