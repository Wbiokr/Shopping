<template>
  <div class="dashboard-container w-per-100 h-per-100 p-t-50 p-l-20">
    <!-- <component :is="currentRole"/> -->
      <h1 class="f-s-40 f-w-600">欢迎登录！</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
