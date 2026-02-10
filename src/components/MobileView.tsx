import { useRef } from "react"
import ThinkingCat from "./ThinkingCat"

export default function MobileView() {
    const textRef = useRef<HTMLDivElement>(null)

    return (
        <div
            className="fixed inset-0 bg-linear-to-b from-rose-50 via-rose-50 to-white flex flex-col items-center justify-center p-8 z-[9999] text-center overflow-auto animate-in fade-in duration-1000"
        >
            {/* Decorative background blooms */}
            <div className="absolute -top-20 -left-20 size-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 size-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <ThinkingCat texts={["Hmmm... too cramped in here","Try your laptop", "I promise 'Miss P' will love this 🌹"]} />


                <div ref={textRef} className="space-y-6 max-w-md">
                    <h1 className="text-4xl font-bold text-rose-900 cherry-font leading-tight tracking-tight mt-10">
                        Wait a minute! 🐾
                    </h1>
                </div>
            </div>
        </div>
    )
}
