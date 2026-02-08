import { type RefObject, useState, useEffect } from "react"
import { Music, Music2, Music3, Music4 } from "lucide-react"

type Props = {
  audioRef: RefObject<HTMLAudioElement>
  enabled: boolean
  onToggle?: (playing: boolean) => void
}

export default function MusicToggle({ audioRef, enabled, onToggle }: Props) {
  const [playing, setPlaying] = useState(enabled)

  useEffect(() => {
    setPlaying(enabled)
  }, [enabled])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || !enabled) return

    if (audio.paused) {
      audio.play()
      setPlaying(true)
      onToggle?.(true)
    } else {
      audio.pause()
      setPlaying(false)
      onToggle?.(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 flex items-center justify-center">
      {/* Floating Notes Container */}
      {playing && (
        <div className="absolute inset-0 pointer-events-none">
          <Note delay="0s" left="50%" duration="2.5s" Icon={Music} />
          <Note delay="0.5s" left="40%" duration="3s" Icon={Music2} />
          <Note delay="1.2s" left="60%" duration="2.8s" Icon={Music3} />
          <Note delay="2s" left="30%" duration="3.2s" Icon={Music4} />
          <Note delay="2.5s" left="70%" duration="2.6s" Icon={Music} />
        </div>
      )}

      {/* Record Player Button */}
      <button
        onClick={toggle}
        className={`
          relative flex items-center justify-center
          w-24 h-24 sm:w-28 sm:h-28
          rounded-full
          bg-black shadow-xl
          border-[3px] border-zinc-800
          transition-transform active:scale-95
          animate-[spin_4s_linear_infinite]
        `}
        style={{ animationPlayState: playing ? "running" : "paused" }} // Lock rotation
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {/* Vinyl texture/grooves */}
        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(#333, #333 1px, #111 2px, #111 3px)] opacity-50" />

        {/* Center Label */}
        <div className="relative z-10 w-[65%] h-[65%] rounded-full overflow-hidden border-2 border-zinc-900 bg-rose-200 shadow-sm">
          <img
            src={`${import.meta.env.BASE_URL}images/alice.jpeg`}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
          {/* Center hole */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full" />
        </div>
      </button>

      <style>{`
        @keyframes float-note {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg) scale(0.5);
          }
          10% {
            opacity: 1;
            transform: translateY(-20px) rotate(10deg) scale(1);
          }
          40% {
            transform: translateY(-60px) rotate(-15deg) translateX(-15px) scale(1.1);
          }
          70% {
            opacity: 0.8;
            transform: translateY(-100px) rotate(10deg) translateX(15px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-140px) rotate(-20deg) translateX(-20px) scale(0.5);
          }
        }
        .animate-float-note {
          animation-name: float-note;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

function Note({ delay, left, duration, Icon }: { delay: string, left: string, duration: string, Icon: React.ElementType }) {
  return (
    <div
      className="absolute top-0 text-rose-500 animate-float-note"
      style={{
        left,
        animationDelay: delay,
        animationDuration: duration
      }}
    >
      <Icon size={24} />
    </div>
  )
}