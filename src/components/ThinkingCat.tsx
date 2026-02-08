import { useRef, useEffect, useState } from "react"
import Lottie from "lottie-react"
import gsap from "gsap"
import catAnimation from "../assets/animations/cat.json"

interface ThinkingCatProps {
    texts?: string[]
}

export default function ThinkingCat({ texts = ["hmmm...", "what's this?"] }: ThinkingCatProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const bubble1Ref = useRef<HTMLDivElement>(null)
    const bubble2Ref = useRef<HTMLDivElement>(null)
    const cloudRef = useRef<HTMLDivElement>(null)

    // State to track current text
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 2,
                // Update text when the animation cycle (including delay) completes
                onRepeat: () => {
                    setCurrentIndex((prev) => (prev + 1) % texts.length)
                }
            })

            // Initial state
            gsap.set([bubble1Ref.current, bubble2Ref.current, cloudRef.current], {
                opacity: 0,
                scale: 0
            })

            // Animate in sequence
            tl.to(bubble1Ref.current, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
            })
                .to(bubble2Ref.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                }, "-=0.2")
                .to(cloudRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.5)",
                }, "-=0.2")

                // Stay visible for a while
                .to({}, { duration: 3 })

                // Pop out
                .to([bubble1Ref.current, bubble2Ref.current, cloudRef.current], {
                    opacity: 0,
                    scale: 0,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "back.in(1.7)"
                })

        }, containerRef)

        return () => ctx.revert()
    }, [texts.length])

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <Lottie
                animationData={catAnimation}
                loop
                autoplay
            />

            {/* Thought Bubbles Container - Centered and anchored at bottom */}
            <div className="absolute bottom-[75%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 min-w-[250px]">
                {/* Cloud (Text Bubble) */}
                <div
                    ref={cloudRef}
                    className="relative bg-white rounded-[2rem] px-6 py-4 shadow-xl border-2 border-pink-100 min-w-[140px] max-w-[220px] text-center mb-4 origin-bottom"
                >
                    <span className="text-gray-800 font-bold text-lg leading-tight cherry-font block break-words">
                        {texts[currentIndex]}
                    </span>
                    {/* Cloud bumps for style */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full -z-10 border-l-2 border-pink-50" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full -z-10 border-r-2 border-pink-50" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-8 bg-white rounded-full -z-10 border-t-2 border-pink-50" />
                </div>

                {/* STEM of bubbles */}
                <div className="flex flex-col items-center w-full">
                    {/* Medium Bubble - Slight offset for natural feel */}
                    <div
                        ref={bubble2Ref}
                        className="w-5 h-5 bg-white rounded-full shadow-md border border-pink-100 mb-2 translate-x-[15px] origin-center"
                    />

                    {/* Small Bubble - Closer to the cat's head */}
                    <div
                        ref={bubble1Ref}
                        className="w-3 h-3 bg-white rounded-full shadow-sm border border-pink-100 translate-x-[30px] origin-center"
                    />
                </div>
            </div>
        </div>
    )
}
