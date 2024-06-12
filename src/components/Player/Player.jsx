import ReactPlayer from "react-player";
import { useState, useRef } from "react";
import styles from "./Player.module.css";
import Duration from "./Duration";
import screenfull from "screenfull";
import { IoMdPlay } from "react-icons/io";
import { IoMdPause } from "react-icons/io";
import { FiVolume, FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Player({ url, onClose }) {
  const player = useRef();
  const playerDiv = useRef();
  const hideAfterTime = 1000;
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [seeking, setSeeking] = useState(false);
  const [status, setStatus] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
  });
  const [playbackRate, setPlaybackRate] = useState(1);
  const [duration, setDuration] = useState(0);
  const [fullScreenBtn, setFullScreenBtn] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hideBtn, setHideBtn] = useState(false);

  const handleProgress = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setStatus({ ...state });
    }
  };
  const handleDuration = (duration) => {
    setDuration(parseFloat(duration));
  };
  const handleOnPlaybackRateChange = (speed) => {
    setPlaybackRate(parseFloat(speed));
  };
  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };
  const handleSeekChange = (e) => {
    player.current.seekTo(parseFloat(e.target.value));
    setStatus((prevState) => ({
      ...prevState,
      played: parseFloat(e.target.value),
    }));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    player.current.seekTo(parseFloat(e.target.value));
  };
  const handleVolumeMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.7);
    }
  };
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  const handleClickFullscreen = () => {
    if (screenfull.isEnabled) {
      // screenfull.request(player.current.wrapper);
      screenfull.toggle(playerDiv.current);
      screenfull.on("change", () => {
        screenfull.isFullscreen
          ? setFullScreenBtn(true)
          : setFullScreenBtn(false);
      });
    }
  };
  const hideBtnDiv = () => {
    if (playing) {
      setTimeout(() => {
        setHideBtn(true);
      }, hideAfterTime);
    }
  };
  const showBtnDiv = () => {
    setHideBtn(false);
    hideBtnDiv();
  };
  const handleMouseMove = (event) => {
    let x = event.clientX;
    let y = event.clientY;
    if (coords.x !== x || coords.y !== y) {
      showBtnDiv();
    }
    setCoords({
      x,
      y,
    });
  };

  return (
    <>
      <div
        ref={playerDiv}
        onMouseMove={handleMouseMove}
        className={styles.player_wrapper}
      >
        {/* <div ref={playerDiv} className="w-full"> */}
        <ReactPlayer
          width="100%"
          height="100%"
          ref={player}
          id="react-player"
          className={styles.react_player}
          controls={false}
          url={`https://player.vimeo.com/video/${url}`}
          // Disable download button
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
            vimeo: {
              url: `https://player.vimeo.com/video/${url}`,
              playerOptions: {
                // controls: false,
                sideDock: 0,
              },
            },
          }}
          // Disable right click
          onContextMenu={(e) => e.preventDefault()}
          playing={playing}
          onPlay={() => {
            setPlaying(true);
          }}
          onPause={() => {
            setPlaying(false);
            setHideBtn(false);
          }}
          onEnded={() => {
            onClose();
          }}
          // onError={() => {
          //   toast.error("Video not Found");
          // }}
          volume={volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          playbackRate={playbackRate}
          onPlaybackRateChange={handleOnPlaybackRateChange}
        />
        <div
          className={`${styles.btnDiv} `}
          style={{ display: hideBtn ? "" : "" }}
        >
          <div
            className={`${styles.play} `}
            onClick={() => setPlaying((prev) => !prev)}
          >
            {playing ? <IoMdPause /> : <IoMdPlay />}
          </div>
          <div className={styles.btnBackground}>
            <div className={styles.track}>
              <Duration
                seconds={duration * status.played}
                className={styles.durationL}
              />
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={status.played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                className={styles.duration}
              />
              <Duration seconds={duration} className={styles.durationR} />
            </div>
            <div className={styles.vlmDiv}>
              {volume === 0 ? (
                <FiVolumeX
                  className={styles.vlmBtn}
                  style={{
                    color: "#E74C3C",
                  }}
                  onClick={handleVolumeMute}
                />
              ) : null}
              {volume > 0 && volume <= 0.3 ? (
                <FiVolume
                  className={styles.vlmBtn}
                  onClick={handleVolumeMute}
                />
              ) : null}
              {volume > 0.3 && volume < 0.8 ? (
                <FiVolume1
                  className={styles.vlmBtn}
                  onClick={handleVolumeMute}
                />
              ) : null}
              {volume >= 0.8 ? (
                <FiVolume2
                  className={styles.vlmBtn}
                  onClick={handleVolumeMute}
                />
              ) : null}

              <input
                className={styles.vlm}
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
            {!fullScreenBtn ? (
              <AiOutlineFullscreen
                onClick={handleClickFullscreen}
                style={{
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <AiOutlineFullscreenExit
                onClick={handleClickFullscreen}
                style={{
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
