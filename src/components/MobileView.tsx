import Lottie from "lottie-react"
import catAnimation from "../assets/animations/cat.json"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import ThinkingCat from "./ThinkingCat"

export default function MobileView() {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: "power2.out" }
            )
        }
        if (textRef.current) {
            gsap.fromTo(textRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)", delay: 0.5 }
            )
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-linear-to-b from-rose-50 to-white flex flex-col items-center justify-center p-8 z-[9999] text-center overflow-hidden"
        >
            {/* Decorative background blooms */}
            <div className="absolute -top-20 -left-20 size-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 size-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <ThinkingCat texts={["Hmmm... too cramped in here", "Miss P would love this, I promise! 🌹","Remember? your laptop? 💻"]} />


                <div ref={textRef} className="space-y-6 max-w-md">
                    <h1 className="text-4xl font-bold text-rose-900 cherry-font leading-tight tracking-tight mt-10">
                        Wait a minute! 🐾
                    </h1>
                </div>
            </div>
        </div>
    )
}
