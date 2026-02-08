import { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type Props = {
    onDateSelected?: (date: Date) => void
}

export default function DateSelectionCard({ onDateSelected }: Props) {
    const [date, setDate] = useState<Date>()
    const calendarCardRef = useRef<HTMLDivElement>(null)
    const buttonCardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cards = [calendarCardRef.current, buttonCardRef.current]
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

    const handleConfirm = () => {
        if (date) {
            onDateSelected?.(date)
            gsap.to(".confirm-btn", {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            })
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            {/* Card 1: Calendar */}
            <div
                ref={calendarCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-2 border-rose-100/50 p-8 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 size-40 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-center w-full">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="rounded-2xl border-none"
                        style={{ "--cell-size": "3.5rem" } as any}
                        startMonth={new Date()}
                        endMonth={new Date(2026, 3, 15)}
                        classNames={{
                            months: "w-full flex justify-center",
                            month: "w-full space-y-4 flex flex-col items-center px-2",
                            caption: "flex justify-center pt-1 relative items-center w-full mb-4",
                            caption_label: "text-2xl font-bold text-rose-900 cherry-font",
                            nav: "absolute inset-x-0 flex justify-between items-center px-2 pointer-events-none",
                            button_previous: "h-10 w-10 bg-white/50 hover:bg-white border border-rose-100 rounded-full flex items-center justify-center transition-colors shadow-sm pointer-events-auto",
                            button_next: "h-10 w-10 bg-white/50 hover:bg-white border border-rose-100 rounded-full flex items-center justify-center transition-colors shadow-sm pointer-events-auto",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex w-full mt-2 justify-between",
                            head_cell: "text-rose-400 rounded-md w-14 font-medium text-sm",
                            row: "flex w-full mt-2 justify-between",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                            day: "h-14 w-14 p-0 font-bold text-lg text-rose-700 hover:bg-rose-100 hover:text-rose-900 rounded-2xl transition-all aria-selected:opacity-100",
                            selected: "bg-rose-500 text-white hover:bg-rose-600 hover:text-white rounded-2xl shadow-md transform scale-110",
                            today: "bg-rose-100 text-rose-900 rounded-2xl",
                            outside: "text-rose-200 opacity-50",
                            disabled: "text-rose-200 opacity-50",
                            day_button: "h-14 w-14 flex items-center justify-center rounded-2xl",
                        } as any}
                    />
                </div>
            </div>

            {/* Card 2: Confirm Button */}
            <div
                ref={buttonCardRef}
                className="w-full bg-white/95 backdrop-blur-md rounded-[2rem] shadow-xl border-2 border-rose-100/50 p-6 flex justify-between items-center"
            >
                <div className="flex-1 text-left px-2">
                    {date ? (
                        <p className="text-rose-800 font-bold cherry-font text-lg">
                            Ready for {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}?
                        </p>
                    ) : (
                        <p className="text-rose-300 font-medium cherry-font text-lg">
                            Pick a day... 🌹
                        </p>
                    )}
                </div>
                <Button
                    onClick={handleConfirm}
                    disabled={!date}
                    className="confirm-btn min-w-[160px] bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold h-14 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:bg-slate-300 text-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 px-8"
                >
                    Confirm ✨
                </Button>
            </div>
        </div>
    )
}
