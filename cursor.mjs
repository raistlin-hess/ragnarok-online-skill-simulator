/**
 * frameCount is 0-indexed
 */
export const CURSOR_CONFIGS = {
  DEFAULT: {
    type: 'default',
    frameCount: 7,
    repeatDelayFrameCount: 28,
  },
  // POINTER: {
  //   type: 'pointer',
  //   frameCount: 1,
  // },
};
const animationScale = 10;


let cursorIntervalId;
let cursorRepeatTimeoutId;

function* getCurrentFrame(cursorType) {
  let frame = 0;
  do {
    if (frame > cursorType.frameCount - 1) {
      frame = 0;
    }

    yield frame;
    frame++;
  } while (true);
}

export function startAnimation(cursorType) {
  if (cursorIntervalId) {
    clearInterval(cursorIntervalId);
    cursorIntervalId = undefined;
  }
  if (cursorRepeatTimeoutId) {
    clearTimeout(cursorRepeatTimeoutId);
    cursorRepeatTimeoutId = undefined;
  }

  const frameGenerator = getCurrentFrame(cursorType);
  const intervalDelay = cursorType.frameCount * animationScale;
  cursorIntervalId = setInterval(() => {
    const currentFrame = frameGenerator.next().value;
    //TODO: Move to referencing Base64 to reduce network traffic
    document.body.style.setProperty(`--cursor-${cursorType.type}`, `url(cursors/${cursorType.type.toLowerCase()}/${currentFrame}.png`);

    //Loop animation by added delay
    if (currentFrame == cursorType.frameCount - 1) {
      clearInterval(cursorIntervalId);
      cursorIntervalId = undefined;
      cursorRepeatTimeoutId = setTimeout(() => startAnimation(cursorType), cursorType.repeatDelayFrameCount * animationScale);
    }
  }, intervalDelay);
}

export function stopAnimation() {
  if (cursorIntervalId) {
    clearInterval(cursorIntervalId);
    cursorIntervalId = undefined;
  }
  if (cursorRepeatTimeoutId) {
    clearTimeout(cursorRepeatTimeoutId);
    cursorRepeatTimeoutId = undefined;
  }
}
