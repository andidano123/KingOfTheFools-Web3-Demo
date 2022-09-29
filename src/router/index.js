/**
 * It's a so simple demo, so I don't use router, this file were created by vue init command, and I removed unused route infos.
 */
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
});

export default router;
