<script>
  import { onMount } from "svelte";

  let canvas;

  const r = Math.random();

  onMount(() => {
    const context = canvas.getContext("2d");
    let frame, loop;

    (loop = () => {
      frame = requestAnimationFrame(loop);

      const image = context.getImageData(0, 0, canvas.width, canvas.height);

      for (let p = 0; p < image.data.length; p += 4) {
        const i = p / 4,
          x = i % canvas.width,
          y = (i / canvas.height) >>> 0;

        const t = window.performance.now();

        const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 2500),
          g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 2500),
          b = 128;

        image.data[p + 0] = r;
        image.data[p + 1] = g;
        image.data[p + 2] = b;
        image.data[p + 3] = 255;
      }
      context.putImageData(image, 0, 0);
    })();

    return () => cancelAnimationFrame(frame);
  });
</script>

<style>
  canvas {
    width: 100px;
    height: 100px;
    background-color: white;
    -webkit-mask: url(../../assets/blackbox.svg) 50% 50% no-repeat;
    mask: url(../../assets/blackbox.svg) 50% 50% no-repeat;
  }
</style>

<canvas bind:this={canvas} width={32} height={32} />
