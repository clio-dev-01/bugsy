import { useRef, useEffect } from "react"
import Lottie from "lottie-react"
import gsap from "gsap"
import kissAnimation from "../assets/animations/kiss.json"

interface SuccessCardProps {
    date: Date | undefined
}

export default function SuccessCard({ date }: SuccessCardProps) {
    const mainCardRef = useRef<HTMLDivElement>(null)
    const actionCardRef = useRef<HTMLDivElement>(null)

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

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {/* Card 1: Celebration */}
            <div
                ref={mainCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-2 border-rose-100/50 p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="size-60 rounded-2xl overflow-hidden shadow-inner relative z-10">
                    <Lottie animationData={kissAnimation} loop autoplay />
                </div>

                <div className="space-y-2 relative z-10">
                    <h2 className="text-4xl font-bold text-rose-900 cherry-font leading-tight">
                        It's a Date! ❤️
                    </h2>
                    <p className="text-lg text-rose-600 font-medium cherry-font">
                        {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "See you soon!"}
                    </p>
                </div>
            </div>

            {/* Card 2: Final Message */}
            <div
                ref={actionCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-rose-100/50 p-8 flex flex-col items-center relative overflow-hidden"
            >
                <p className="text-2xl font-bold text-rose-800 cherry-font text-center">
                    I'll pick you up at 9 a.m.! 🌸
                </p>
                <p className="text-sm text-rose-400 font-medium mt-2">
                    Check your email (or I'll just know 😉)
                </p>
            </div>
        </div>
    )
}
