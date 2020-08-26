<template>
  <div>
    <div class="zoom-on-hover d-flex justify-content-center" v-bind:class="{zoomed}" @touchstart="touchzoom"
         @mousemove="move" @mouseenter="zoom" @mouseleave="unzoom">
      <img class="normal" ref="normal" :src="imgNormal"/>
      <img class="zoom" ref="zoom" :src="imgZoom || imgNormal"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        scaleFactor: 1,
        resizeCheckInterval: null,
        zoomed: false
      }
    },
    mounted: function() {
      if (this.$props.scale) {
        this.scaleFactor = parseInt(this.$props.scale)
        this.$refs.zoom.style.transform = "scale(" + this.scaleFactor + ")"
      }
      this.initEventLoaded()
      this.initEventResized()
    },
    updated: function() {
      this.initEventLoaded()
    },
    beforeDestroy: function() {
      this.resizeCheckInterval && clearInterval(this.resizeCheckInterval)
    },
    props: ["imgNormal", "imgZoom", "scale", "disabled"],
    methods: {
      touchzoom: function(event) {
        if (this.disabled) return
        this.move(event)
        this.zoomed = !this.zoomed
      },
      zoom: function() {
        if (!this.disabled) this.zoomed = true
      },
      unzoom: function() {
        if (!this.disabled) this.zoomed = false
      },
      move: function(event) {
        if (this.disabled || !this.zoomed) return
        var offset = pageOffset(this.$el)
        var zoom = this.$refs.zoom
        var normal = this.$refs.normal
        var relativeX = event.clientX - offset.x + window.pageXOffset
        var relativeY = event.clientY - offset.y + window.pageYOffset
        var normalFactorX = relativeX / normal.offsetWidth
        var normalFactorY = relativeY / normal.offsetHeight
        var x = normalFactorX * (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth)
        var y = normalFactorY * (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight)
        zoom.style.left = -x + "px"
        zoom.style.top = -y + "px"
      },
      initEventLoaded: function() {
        // emit the "loaded" event if all images have been loaded
        var promises = [this.$refs.zoom, this.$refs.normal].map(function(image) {
          return new Promise(function(resolve, reject) {
            image.addEventListener("load", resolve)
            image.addEventListener("error", reject)
          })
        })
        var component = this
        Promise.all(promises).then(function() {
          component.$emit("loaded")
        })
      },
      initEventResized: function() {
        var normal = this.$refs.normal
        var previousWidth = normal.offsetWidth
        var previousHeight = normal.offsetHeight
        var component = this
        this.resizeCheckInterval = setInterval(function() {
          if ((previousWidth != normal.offsetWidth) || (previousHeight != normal.offsetHeight)) {
            previousWidth = normal.offsetWidth
            previousHeight = normal.offsetHeight
            component.$emit("resized", {
              width: normal.width,
              height: normal.height,
              fullWidth: normal.naturalWidth,
              fullHeight: normal.naturalHeight
            })
          }
        }, 1000)
      }
    },
  }
</script>

<style lang="scss">
  .zoom-on-hover {
    position: relative;
    overflow: hidden;

    .zoom,
    .normal {
      opacity: 1;

      border-radius: .2rem !important;
    }
  }
  .zoom-on-hover .normal {
    width: 90%;
  }
  .zoom-on-hover .zoom {
    position: absolute;
    opacity: 0;
    transform-origin: top left;
  }
  .zoom-on-hover.zoomed {

    .zoom,
    .normal {
      opacity: 1;
    }

  }
</style>
