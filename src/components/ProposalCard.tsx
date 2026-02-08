import { useState, useRef, useEffect } from "react"
import Lottie from "lottie-react"
import gsap from "gsap"
import confetti from "canvas-confetti"
import kissAnimation from "../assets/animations/kiss.json"
import dogAnimation from "../assets/animations/dog-love.json"
interface Props {
    question: string
    successQuestion?: string
    yesAudio: string
    noAudios: string[]
    onYes?: () => void
    onNo?: (count: number) => void
    onContinue?: () => void
}


export default function ProposalCard({
    question,
    successQuestion = "Yay! I knew it! ❤️",
    yesAudio,
    noAudios,
    onYes,
    onNo,
    onContinue,
}: Props) {
    const [noCount, setNoCount] = useState(0)
    const [yesPressed, setYesPressed] = useState(false)
    const mainCardRef = useRef<HTMLDivElement>(null)
    const actionCardRef = useRef<HTMLDivElement>(null)
    const rejectionMsgs = [
        "Okay... I'll wait. That stings a little.",
        "Oof. That one really hurt, not gonna lie.",
        "I'm out of tears now. She has no choice anymore."
    ]

    // Audio refs
    const yesAudioRef = useRef<HTMLAudioElement | null>(null)
    const noAudioRefs = useRef<(HTMLAudioElement | null)[]>([])

    // Initialize audio refs array based on noAudios length
    useEffect(() => {
        noAudioRefs.current = noAudioRefs.current.slice(0, noAudios.length)
    }, [noAudios])

    // Entrance animation
    useEffect(() => {
        const cards = [mainCardRef.current, actionCardRef.current]
        gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 })
        gsap.to(cards, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)"
        })
    }, [])

    const stopPreviousAudio = () => {
        // pause previous
        if (noCount > 0) {
            const prevAudio = noAudioRefs.current[noCount - 1]
            if (prevAudio) {
                prevAudio.pause()
            }
        }
    }

    const handleNo = () => {
        const newCount = noCount + 1
        setNoCount(newCount)
        onNo?.(newCount)

        stopPreviousAudio()
        // Play "No" audio (cycle through list)
        const audioIndex = noCount % noAudios.length
        const audio = noAudioRefs.current[audioIndex]
        if (audio) {
            audio.currentTime = 0
            audio.play().catch(e => console.log("No audio play error", e))
        }
    }

    const handleYes = () => {
        setNoCount(0)
        setYesPressed(true)
        onYes?.()

        stopPreviousAudio()
        // Play "Yes" audio 
        if (yesAudioRef.current) {
            yesAudioRef.current.currentTime = 0
            yesAudioRef.current.play().catch(e => console.log("Yes audio play error", e))
        }

        // Confetti!
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#ff577f", "#ff884b", "#ffc764", "#cdb4db", "#ffafcc"]
            })
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#ff577f", "#ff884b", "#ffc764", "#cdb4db", "#ffafcc"]
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()
    }

    const noGifs = [
        "",
        `${import.meta.env.BASE_URL}images/doakes.gif`,
        `${import.meta.env.BASE_URL}images/minion.gif`,
        `${import.meta.env.BASE_URL}images/rat.gif`,
    ]

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Card 1: Main Content */}
            <div
                ref={mainCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-2 border-rose-100/50 p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
                {/* Decorative background glows */}
                <div className="absolute -top-10 -right-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

                {/* Preload Audios */}
                <audio ref={yesAudioRef} src={yesAudio} className="hidden" />
                {noAudios.map((src, i) => (
                    <audio
                        key={i}
                        ref={(el) => {
                            noAudioRefs.current[i] = el
                        }}
                        src={src}
                        className="hidden"
                    />
                ))}

                <div className="size-60 rounded-2xl overflow-hidden shadow-inner relative z-10">
                    {noCount > 0 ? (
                        <img src={noGifs[noCount]} className="w-full h-full object-cover animate-fade-in" alt="" />
                    ) : (
                        <Lottie animationData={yesPressed ? kissAnimation : dogAnimation} loop autoplay />
                    )}
                </div>

                <div className="space-y-2 relative z-10">
                    <h2 className="text-3xl font-bold text-rose-900 cherry-font leading-tight">
                        {yesPressed ? successQuestion : question}
                    </h2>
                    {noCount > 0 && (
                        <p className="text-sm text-rose-500/70 cherry-font leading-relaxed">
                            {rejectionMsgs[(noCount - 1) % rejectionMsgs.length]}
                        </p>
                    )}
                </div>
            </div>

            {/* Card 2: Actions */}
            <div
                ref={actionCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-rose-100/50 p-6 flex flex-col items-center relative overflow-hidden"
            >
                {!yesPressed ? (
                    <div className="flex gap-4 items-center justify-center w-full overflow-hidden">
                        <button
                            onClick={handleYes}
                            style={{ width: `${128 + noCount * 60}px` }}
                            className="px-8 py-4 rounded-2xl bg-rose-500 text-white font-bold text-lg shadow-lg hover:bg-rose-600 transition-all origin-center whitespace-nowrap active:scale-95"
                        >
                            Yes!
                        </button>
                        {noCount < 3 && (
                            <button
                                onClick={handleNo}
                                style={{ transform: `scale(${Math.max(0.1, 1 - noCount * 0.3)})` }}
                                className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-lg shadow-md hover:bg-slate-200 transition-all w-32 origin-center active:scale-90"
                            >
                                No
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        <button
                            onClick={onContinue}
                            className="w-full px-8 py-4 rounded-2xl bg-rose-500 text-white font-bold text-lg shadow-lg hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all elastic-btn"
                        >
                            Pick a Date! ✨
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
