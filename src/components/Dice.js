import React, { useState } from "react";

const DiceTray = () => {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [showRoll, setShowRoll] = useState(false);
  const [isRolling, setIsRolling] = useState(null);
  const [rollResult, setRollResult] = useState(null);
  
  const [d20Count, setD20Count] = useState(0);
  const [d12Count, setD12Count] = useState(0);
  const [d10Count, setD10Count] = useState(0);
  const [d100Count, setD100Count] = useState(0);
  const [d8Count, setD8Count] = useState(0);
  const [d6Count, setD6Count] = useState(0);
  const [d4Count, setD4Count] = useState(0);

  const openTray = () => setIsTrayOpen(true);

  const closeTray = () => {
    setIsTrayOpen(false);
    resetDice();
    setShowRoll(false);
    setRollResult(null);
  };

  const resetDice = () => {
    setD20Count(0);
    setD12Count(0);
    setD10Count(0);
    setD100Count(0);
    setD8Count(0);
    setD6Count(0);
    setD4Count(0);
    setShowRoll(false);
    setRollResult(null);
  }

  const incrementDie = (setter, count) => {
    setter(count + 1);
    setShowRoll(true);
  }

  const roll = (sides, times) =>
    Array.from({ length: times }, () => Math.floor(Math.random() * sides) + 1)
      .reduce((a, b) => a + b, 0);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    setRollResult(null);
    
    const finalTotal = 
      roll(20, d20Count) +
      roll(12, d12Count) +
      roll(10, d10Count) +
      roll(100, d100Count) +
      roll(8, d8Count) +
      roll(6, d6Count) +
      roll(4, d4Count)

    let flashes = 0;
    const interval = setInterval(() => {
        const fakeTotal = Math.floor(Math.random() * (20 * 5));
        setRollResult(fakeTotal);
        flashes++;
    }, 10);

    setTimeout(() => {
        clearInterval(interval);
        setRollResult(finalTotal);
        setIsRolling(false);
    }, 500);
  };

  return (
    <>
      {/* Open dice tray button */}
      <button
        aria-label="Open dice tray"
        className="absolute top-6 left-6 z-10 cursor-pointer"
        onClick={openTray}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          className="size-8 fill-gray-400 hover:fill-red active:fill-activered"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M243.7 3.4c7.6-4.6 17.1-4.6 24.7 0l200 120c7.2 4.3 11.7 12.1 11.7 20.6l0 224c0 8.4-4.4 16.2-11.7 20.6l-200 120c-7.6 4.6-17.1 4.6-24.7 0l-200-120C36.4 384.2 32 376.4 32 368l0-224c0-8.4 4.4-16.2 11.7-20.6l200-120zM80 191.1l0 83.4L112.8 215 80 191.1zm65.5 63.9L94.9 347l115 9.2L145.5 255.1zm10.6 145L232 445.6l0-39.5-75.9-6.1zM280 406.2l0 39.5 75.9-45.5L280 406.2zM432 274.6l0-83.4L399.2 215 432 274.6zM375 173.3l37.6-27.3L327.1 94.6 375 173.3zM184.9 94.6L99.4 145.9 137 173.3l47.9-78.6zM256 70.2L186.7 184l138.6 0L256 70.2zM324.3 232l-136.6 0L256 339.3 324.3 232zM302.1 356.2l115-9.2-50.6-92L302.1 356.2z" />
        </svg>
      </button>

      {/* Close dice tray button */}
      {isTrayOpen && (
        <button
          aria-label="Close dice tray"
          className="group flex justify-center items-center absolute top-4 left-4 z-40 size-12 bg-gray-600 active:bg-gray-700 rounded-full cursor-pointer"
          onClick={closeTray}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="size-8 fill-white group-hover:fill-red group-active:fill-activered"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      )}

      {/* Roll dice button */}
      {isTrayOpen && (
        <button
          aria-label="Roll dice"
          className={`
            flex justify-center items-center absolute top-3.5 left-0 z-30 ps-16.25 pe-6 min-w-48 h-13 font-roboto text-xl font-bold bg-red active:bg-activered rounded-full cursor-pointer transform transition-transform duration-300
            ${showRoll ? "translate-x-3.5" : "-translate-x-full"}
          `}
          onClick={rollDice}
        >
          ROLL
          {rollResult !== null && (
            <span
              className={`
                ms-1 transition-opacity duration-300
                ${isRolling ? "opacity-70" : "opacity-100"}
                `}
            >
              = {rollResult}
            </span>
          )}
        </button>
      )}

      {/* Dice tray */}
      <div
        className={`
          absolute top-0 left-3 z-20 p-1 pt-14.5 space-y-1 bg-white/50 rounded-full transform transition-transform duration-300
          ${isTrayOpen ? "translate-y-3" : "-translate-y-full"}
        `}
      >
        <button
          aria-label="Add D20"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD20Count, d20Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M243.7 3.4c7.6-4.6 17.1-4.6 24.7 0l200 120c7.2 4.3 11.7 12.1 11.7 20.6l0 224c0 8.4-4.4 16.2-11.7 20.6l-200 120c-7.6 4.6-17.1 4.6-24.7 0l-200-120C36.4 384.2 32 376.4 32 368l0-224c0-8.4 4.4-16.2 11.7-20.6l200-120zM80 191.1l0 83.4L112.8 215 80 191.1zm65.5 63.9L94.9 347l115 9.2L145.5 255.1zm10.6 145L232 445.6l0-39.5-75.9-6.1zM280 406.2l0 39.5 75.9-45.5L280 406.2zM432 274.6l0-83.4L399.2 215 432 274.6zM375 173.3l37.6-27.3L327.1 94.6 375 173.3zM184.9 94.6L99.4 145.9 137 173.3l47.9-78.6zM256 70.2L186.7 184l138.6 0L256 70.2zM324.3 232l-136.6 0L256 339.3 324.3 232zM302.1 356.2l115-9.2-50.6-92L302.1 356.2z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D20</span>
          {d20Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d20Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D12"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD12Count, d12Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M200.3 48L158.7 72 256 102.8 353.3 72 311.7 48 200.3 48zm-97.1 56.7L49.7 197.3l83.9 93.1L232 241.2l0-95.6L103.2 104.7zM48 267.1l0 44.7 55.7 96.5L140 429.2l-33.1-96.8L48 267.1zM202.7 464l108 0 43.9-131.8L256 282.8l-98.5 49.3L202.7 464zm170.5-35.4l35.2-20.3L464 311.7l0-44.7-58.8 65.3-32.1 96.2zm89.2-231.3l-53.4-92.5L280 145.6l0 95.6 98.4 49.2 83.9-93.1zM176.3 6.4c7.3-4.2 15.6-6.4 24-6.4L311.7 0c8.4 0 16.7 2.2 24 6.4l96.5 55.7c7.3 4.2 13.4 10.3 17.6 17.6l55.7 96.5c4.2 7.3 6.4 15.6 6.4 24l0 111.5c0 8.4-2.2 16.7-6.4 24l-55.7 96.5c-4.2 7.3-10.3 13.4-17.6 17.6l-96.5 55.7c-7.3 4.2-15.6 6.4-24 6.4l-111.5 0c-8.4 0-16.7-2.2-24-6.4L79.7 449.8c-7.3-4.2-13.4-10.3-17.6-17.6L6.4 335.7c-4.2-7.3-6.4-15.6-6.4-24L0 200.3c0-8.4 2.2-16.7 6.4-24L62.2 79.7c4.2-7.3 10.3-13.4 17.6-17.6L176.3 6.4z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D12</span>
          {d12Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d12Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D10"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD10Count, d10Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 0c6.9 0 13.5 3 18 8.2l232 264c4.2 4.8 6.4 11.1 5.9 17.5s-3.4 12.3-8.3 16.5l-232 200c-9 7.8-22.3 7.8-31.3 0l-232-200C3.5 302 .5 296 .1 289.7S1.7 277 6 272.2L238 8.2C242.5 3 249.1 0 256 0zM91.6 247.4l50.9-12 36-86.9L91.6 247.4zM256 86.8L189.7 247 256 291.2 322.3 247 256 86.8zm100.6 195L280 332.8l0 102.8 156.7-135-80-18.8zm63.8-34.3l-86.9-98.9 36 86.9 50.9 12zM232 435.6l0-102.8-76.6-51.1-80 18.8L232 435.6z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D10</span>
          {d10Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d10Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D100"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD100Count, d100Count)}
        >
          <div className="flex">
            <svg
              aria-hidden="true"
              focusable="false"
              class="size-4 fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 0c6.9 0 13.5 3 18 8.2l232 264c4.2 4.8 6.4 11.1 5.9 17.5s-3.4 12.3-8.3 16.5l-232 200c-9 7.8-22.3 7.8-31.3 0l-232-200C3.5 302 .5 296 .1 289.7S1.7 277 6 272.2L238 8.2C242.5 3 249.1 0 256 0zM91.6 247.4l50.9-12 36-86.9L91.6 247.4zM256 86.8L189.7 247 256 291.2 322.3 247 256 86.8zm100.6 195L280 332.8l0 102.8 156.7-135-80-18.8zm63.8-34.3l-86.9-98.9 36 86.9 50.9 12zM232 435.6l0-102.8-76.6-51.1-80 18.8L232 435.6z" />
            </svg>
            <svg
              aria-hidden="true"
              focusable="false"
              class="size-4 fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 0c6.9 0 13.5 3 18 8.2l232 264c4.2 4.8 6.4 11.1 5.9 17.5s-3.4 12.3-8.3 16.5l-232 200c-9 7.8-22.3 7.8-31.3 0l-232-200C3.5 302 .5 296 .1 289.7S1.7 277 6 272.2L238 8.2C242.5 3 249.1 0 256 0zM91.6 247.4l50.9-12 36-86.9L91.6 247.4zM256 86.8L189.7 247 256 291.2 322.3 247 256 86.8zm100.6 195L280 332.8l0 102.8 156.7-135-80-18.8zm63.8-34.3l-86.9-98.9 36 86.9 50.9 12zM232 435.6l0-102.8-76.6-51.1-80 18.8L232 435.6z" />
            </svg>
          </div>
          <span className="font-roboto text-sm font-bold">D100</span>
          {d100Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d100Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D8"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD8Count, d8Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M239 7c9.4-9.4 24.6-9.4 33.9 0L505 239c9.4 9.4 9.4 24.6 0 33.9L273 505c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L239 7zM126.2 324.3L232 430.1l0-62L126.2 324.3zM280 368l0 62L385.8 324.3 280 368zM445.6 247.6L280 81.9l0 234.2 165.6-68.5zM232 81.9L66.4 247.6 232 316.1l0-234.2z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D8</span>
          {d8Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d8Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D6"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD6Count, d6Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M243.9 7.7c-12.4-7-27.6-6.9-39.9 .3L19.8 115.6C7.5 122.8 0 135.9 0 150.1L0 366.6c0 14.5 7.8 27.8 20.5 34.9l184 103c12.1 6.8 26.9 6.8 39.1 0l184-103c12.6-7.1 20.5-20.4 20.5-34.9l0-219.9c0-14.4-7.7-27.7-20.3-34.8L243.9 7.7zM71.8 140.8L224.2 51.7l152 86.2L223.8 228.2l-152-87.4zM48 182.4l152 87.4 0 177.2L48 361.9l0-179.5zM248 447.1l0-177.4 152-90.1 0 182.4L248 447.1z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D6</span>
          {d6Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d6Count}
            </div>
          )}
        </button>

        <button
          aria-label="Add D4"
          className="flex flex-col justify-center items-center relative pt-1 size-12 bg-red active:bg-activered rounded-full cursor-pointer"
          onClick={() => incrementDie(setD4Count, d4Count)}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-4 fill-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M256 0c7.3 0 14.1 3.3 18.7 8.9l232 288c4.1 5.1 5.9 11.5 5.1 18s-4.1 12.3-9.3 16.2l-232 176c-8.6 6.5-20.4 6.5-29 0l-232-176c-5.2-3.9-8.5-9.8-9.3-16.2s1.1-12.9 5.1-18l232-288C241.9 3.3 248.7 0 256 0zM58.2 307.8L232 439.7l0-347.6L58.2 307.8zM280 92.1l0 347.6L453.8 307.8 280 92.1z" />
          </svg>
          <span className="font-roboto text-sm font-bold">D4</span>
          {d4Count > 0 && (
            <div className="flex justify-center items-center absolute -top-0.5 -right-0.5 size-4 font-roboto text-sm font-bold text-red bg-white rounded-full ">
              {d4Count}
            </div>
          )}
        </button>

        <button
          aria-label="Reset dice tray"
          className="group flex flex-col justify-center items-center relative size-12 bg-white active:bg-gray-100 rounded-full cursor-pointer"
          onClick={resetDice}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            class="size-8 fill-red group-active:fill-activered"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
          >
            <path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default DiceTray;
