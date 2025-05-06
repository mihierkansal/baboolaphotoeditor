import { createEffect, createSignal, on, Show } from "solid-js";

function App() {
  const img = createSignal("");
  let fIn!: HTMLInputElement;
  let canvas!: HTMLCanvasElement;

  const hue = createSignal(0);
  const saturation = createSignal(100);
  const brightness = createSignal(100);
  const greyscale = createSignal(0);
  const contrast = createSignal(100);
  const sepia = createSignal(0);

  createEffect(
    on(
      [
        hue[0],
        img[0],
        brightness[0],
        saturation[0],
        sepia[0],
        contrast[0],
        greyscale[0],
      ],
      async () => {
        console.log("ER");
        if (img[0]()) {
          const imageData = img[0]();
          const imageEl = document.createElement("img");

          imageEl.src = imageData;

          document.body.appendChild(imageEl);

          await waitForLoad(imageEl);

          const imgHeight = imageEl.clientHeight;

          const imgWidth = imageEl.clientWidth;

          canvas.width = imgWidth;
          canvas.height = imgHeight;

          const ctx = canvas.getContext("2d")!;

          const filterString = `hue-rotate(${hue[0]()}deg) brightness(${brightness[0]()}%) saturate(${saturation[0]()}%) contrast(${contrast[0]()}%) grayscale(${greyscale[0]()}%) sepia(${sepia[0]()}%)`;
          console.log(filterString);
          // Apply the filter to the image
          ctx.filter = filterString;

          ctx.drawImage(imageEl, 0, 0);

          imageEl.remove();
        }
      }
    )
  );

  function reset() {
    hue[1](0);
    saturation[1](100);
    brightness[1](100);
    greyscale[1](0);
    contrast[1](100);
    sepia[1](0);
  }

  return (
    <>
      <div class="toolbar">
        <input
          ref={fIn}
          accept="image/*"
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files?.length) {
              const file = e.target.files[0];

              const fr = new FileReader();

              fr.onload = (e) => {
                img[1](e.target!.result as string);
                reset();
              };

              fr.readAsDataURL(file);
            }
          }}
        />
        <div class="action-buttons-container">
          <button
            onClick={() => {
              fIn.click();
            }}
          >
            <span>Open file</span>
          </button>
          <button
            disabled={!img[0]()}
            onClick={() => {
              canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob!);
                link.download = "edited.png";
                link.click();
              }, "image/png");
            }}
          >
            <span>Save</span>
          </button>
          <button
            disabled={!img[0]()}
            onClick={() => {
              reset();
            }}
          >
            <span>Reset</span>
          </button>
        </div>

        <label>
          Hue
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={360}
            value={hue[0]()}
            onChange={(e) => {
              console.log("h");
              hue[1](e.target.valueAsNumber);
            }}
          />
        </label>

        <label>
          Saturation
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={200}
            value={saturation[0]()}
            onChange={(e) => {
              saturation[1](e.target.valueAsNumber);
            }}
          />
        </label>
        <label>
          Brightness
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={200}
            value={brightness[0]()}
            onChange={(e) => {
              brightness[1](e.target.valueAsNumber);
            }}
          />
        </label>
        <label>
          Greyscale
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={100}
            value={greyscale[0]()}
            onChange={(e) => {
              greyscale[1](e.target.valueAsNumber);
            }}
          />
        </label>
        <label>
          Contrast
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={200}
            value={contrast[0]()}
            onChange={(e) => {
              contrast[1](e.target.valueAsNumber);
            }}
          />
        </label>
        <label>
          Sepia
          <input
            disabled={!img[0]()}
            type="range"
            min={0}
            max={100}
            value={sepia[0]()}
            onChange={(e) => {
              console.log("h");
              sepia[1](e.target.valueAsNumber);
            }}
          />
        </label>
      </div>
      <div class="main">
        <Show
          fallback={<div>Open an image file to start editing.</div>}
          when={img[0]()}
        >
          <canvas ref={canvas} />
        </Show>
      </div>
    </>
  );
}

function waitForLoad<T>(el: { onload: ((e: T) => void) | null }) {
  return new Promise((resolve) => {
    el.onload = (e) => {
      resolve(e);
    };
  });
}

export default App;
