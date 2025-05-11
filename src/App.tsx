import "baboolastyles/public/plastic.css";
import { createEffect, createSignal, on, Show } from "solid-js";

enum Rotate {
  Zero = 0,
  Ninety = 90,
  OneHundredEighty = 180,
  TwoHundredSeventy = 270,
}

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

  const flip = createSignal(Rotate.Zero);

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
        flip[0],
      ],
      async () => {
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

          if (flip[0]() !== Rotate.Zero) {
            // Store the original width and height
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;

            if (flip[0]() !== Rotate.OneHundredEighty) {
              // Swap width and height to match rotated dimensions
              const newWidth = canvas.height;
              const newHeight = canvas.width;
              // Set new canvas size
              canvas.width = newWidth;
              canvas.height = newHeight;
            }
            // Move the origin to the new top-left corner
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // Convert degrees to radians and rotate
            ctx.rotate((flip[0]() * Math.PI) / 180);

            // Translate back based on the original dimensions
            if (flip[0]() === Rotate.Ninety) {
              ctx.translate(-originalWidth / 2, -originalHeight / 2);
            } else if (flip[0]() === Rotate.OneHundredEighty) {
              ctx.translate(-canvas.width / 2, -canvas.height / 2);
            } else if (flip[0]() === Rotate.TwoHundredSeventy) {
              ctx.translate(-originalWidth / 2, -originalHeight / 2);
            }
          }

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
    flip[1](Rotate.Zero);
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
          <div class="divider"></div>
          <button
            disabled={!img[0]()}
            onClick={() => {
              flip[1]((v) => (v + 90) % 360);
            }}
          >
            <span>Rotate 90º</span>
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
