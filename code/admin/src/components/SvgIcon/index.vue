<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"  />
  </svg>
  <!-- <img :src='icons[iconClass]' /> -->
  <!-- <component :is="require(`@/icons/svg/${iconClass}.svg`)" :class="svgClass" /> -->
</template>

<script>
// import icons from '@/icons/svgs';

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },

  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
