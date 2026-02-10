import { useEffect, useRef, useState, useMemo } from "react"
import gsap from "gsap"
import { Button } from "./ui/button"
import CircularGallery from "./CircularGallery"
import SplitText from "./SplitText"
import Lottie from "lottie-react"
import astAnimation from "../assets/animations/sheep.json"

interface CollageOverlayProps {
    images?: string[]
    onProposalReady: () => void
    onHidden: () => void
}

export default function CollageOverlay({ images = [], onProposalReady, onHidden }: CollageOverlayProps) {
    const [showButton, setShowButton] = useState(false)
    const [showText, setShowText] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const maskState = useRef({
        x: 50,
        y: 80,
        radius: 0
    })
    const [isClosing, setIsClosing] = useState(false)
    const [showCollageContent, setShowCollageContent] = useState(true)
    const [showSheep, setShowSheep] = useState(false)

    // Memoize gallery items to prevent CircularGallery from re-mounting on every re-render
    const galleryItems = useMemo(() => Array.from({ length: 7 }).map((_, i) => ({
        image: `${import.meta.env.BASE_URL}images/slides/${i + 1}.png`,
        text: ''
    })), [])

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const overlay = overlayRef.current
        if (!overlay) return

        // Initialize audio
        const audio = new Audio(`${import.meta.env.BASE_URL}audio/guitar.mp3`)
        audio.loop = false
        audio.volume = 0
        audioRef.current = audio
        audio.onended = () => {
            setTimeout(() => {
                handleAction()
            }, 1000);
        }

        // Flashlight sequence - focused on images at the bottom
        const tl = gsap.timeline({
            onUpdate: () => {
                if (!overlay) return
                overlay.style.setProperty('--mask-x', `${maskState.current.x}%`)
                overlay.style.setProperty('--mask-y', `${maskState.current.y}%`)
                overlay.style.setProperty('--mask-r', `${maskState.current.radius}px`)
            }
        })

        // Start playing audio with fade in
        audio.play().catch(e => console.log("Hero audio failed", e))
        gsap.to(audio, { volume: 0.8, duration: 2 })

        // 0. Flashlight lights up at the bottom
        tl.to(maskState.current,
            { radius: 150, duration: 1, ease: "back.out(1.7)" }
        )

        // 2. Initial scanning zoom - only searching the images area at the bottom
        tl.to(maskState.current, { x: 25, y: 85, duration: 1.5, ease: "power2.inOut" })
            .to(maskState.current, { x: 75, y: 80, duration: 1.5, ease: "power2.inOut" })
            .to(maskState.current, { x: 50, y: 75, duration: 1, ease: "back.out(1.7)" })

        // 3. Expand mask to reveal everything
        tl.to(maskState.current, {
            radius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
            duration: 2.5,
            ease: "expo.inOut",
            onStart: () => setShowSheep(true)
        })

        // 4. Show text and then button
        tl.add(() => {
            setShowText(true)
            setTimeout(() => setShowButton(true), 1500)
        })

        return () => {
            tl.kill()
            gsap.to(audio, {
                volume: 0,
                duration: 0.5,
                onComplete: () => {
                    audio.pause()
                    audio.currentTime = 0
                }
            })
        }
    }, [])

    const handleAction = () => {
        const overlay = overlayRef.current
        setIsClosing(true)
        setShowButton(false)
        setShowText(false)

        // 1. Lights off again + Audio fade out
        if (audioRef.current) gsap.to(audioRef.current, { volume: 0, duration: 0.8 })

        gsap.to(maskState.current, {
            radius: 0,
            duration: 0.8,
            ease: "power4.in",
            onUpdate: () => {
                if (!overlay) return
                overlay.style.setProperty('--mask-x', `${maskState.current.x}%`)
                overlay.style.setProperty('--mask-y', `${maskState.current.y}%`)
                overlay.style.setProperty('--mask-r', `${maskState.current.radius}px`)
            },
            onComplete: () => {
                // 2. Hide content while hidden
                setShowCollageContent(false)

                // 3. Switch parent state
                onProposalReady()

                // 4. Reveal new content
                setTimeout(() => {
                    gsap.to(maskState.current, {
                        x: 50, y: 50,
                        radius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
                        duration: 1.5,
                        ease: "power2.out",
                        onUpdate: () => {
                            if (!overlay) return
                            overlay.style.setProperty('--mask-x', `${maskState.current.x}%`)
                            overlay.style.setProperty('--mask-y', `${maskState.current.y}%`)
                            overlay.style.setProperty('--mask-r', `${maskState.current.radius}px`)
                        },
                        onComplete: () => {
                            // 5. Cleanup
                            onHidden()
                        }
                    })
                }, 400)
            }
        })
    }

    return (
        <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-end overflow-hidden transition-colors duration-500 ${showCollageContent ? 'bg-black' : 'bg-transparent'}`}>

            {/* Sheep animation - absolute top to avoid layout pushing */}
            {showCollageContent && showSheep && (
                <div className="size-48 md:size-64 absolute top-4 md:top-8 z-10 pointer-events-none">
                    <Lottie
                        animationData={astAnimation}
                        loop
                        autoplay
                    />
                </div>
            )}

            {/* Top Text Section - centered in the upper half */}
            <div className="absolute top-[25%] md:top-[34%] w-full flex flex-col items-center justify-center px-8 z-10 pointer-events-none">
                {showText && showCollageContent && showSheep && (
                    <div className="max-w-2xl text-center space-y-4">
                        <SplitText
                            text="Every moment with you,"
                            className="text-3xl md:text-5xl font-bold text-white cherry-font"
                            delay={100}
                            duration={1}
                        />
                        <SplitText
                            text="is a memory I cherish forever."
                            className="text-xl md:text-3xl font-medium text-rose-200 cherry-font"
                            delay={600}
                            duration={1}
                            onLetterAnimationComplete={() => {
                                // setTimeout(() => {
                                //     handleAction()
                                // }, 1000);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Circular Gallery Section - Fixed to bottom center */}
            {showCollageContent && (
                <div key="gallery-container" className="w-full h-[50vh] relative mb-[-5%] overflow-visible">
                    <CircularGallery
                        items={galleryItems}
                        bend={-3}
                        borderRadius={0.05}
                    />
                </div>
            )}

            {/* The Mask Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 z-[100]"
                style={{
                    maskImage: 'radial-gradient(circle at var(--mask-x, 50%) var(--mask-y, 50%), transparent 0 var(--mask-r, 0px), black calc(var(--mask-r, 0px) + 40px))',
                    WebkitMaskImage: 'radial-gradient(circle at var(--mask-x, 50%) var(--mask-y, 50%), transparent 0 var(--mask-r, 0px), black calc(var(--mask-r, 0px) + 40px))',
                    // @ts-ignore - custom properties
                    '--mask-x': `${maskState.current.x}%`,
                    '--mask-y': `${maskState.current.y}%`,
                    '--mask-r': `${maskState.current.radius}px`
                } as any}
            />

            {/* The Button */}
            {/* {showButton && showCollageContent && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] animate-in fade-in zoom-in duration-1000">
                    <Button
                        onClick={handleAction}
                        className=" text-rose-100 hover:bg-rose-50 px-5 py-5 rounded-full  shadow-[0_0_30px_rgba(255,182,193,0.5)] border-2 border-rose-100"
                    >
                        Let's do this!
                    </Button>
                </div>
            )} */}
        </div>
    )
}
