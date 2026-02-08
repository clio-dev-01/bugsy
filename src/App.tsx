import Lottie from "lottie-react"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import heartAnimation from "./assets/animations/birds.json"
import confetti from "canvas-confetti"

import MusicToggle from "./MusicToggle"
import SplitText from "./components/SplitText"
import ThinkingCat from "./components/ThinkingCat"
import TextType from "./components/TextType"
import ProposalCard from "./components/ProposalCard"
import DateSelectionCard from "./components/DateSelectionCard"
import SuccessCard from "./components/SuccessCard"
import PersonalPill from "./PersonalPill"
import MobileView from "./components/MobileView"
import emailjs from "@emailjs/browser"

const NORMAL_CAT_TEXTS = ["What's this?", "Patra are you in there?", "Is it for me?", "Can I eat it?", "Maybe later..."]

// YOU NEED TO FILL THESE IN FROM EMAILJS
const EMAILJS_SERVICE_ID: string = "service_ulw7ejq"
const EMAILJS_TEMPLATE_ID: string = "template_xz2egn7"
const EMAILJS_PUBLIC_KEY: string = "RpRKQnO45IMtRwR-U"

export default function App() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [started, setStarted] = useState(false)
  const [showProposal, setShowProposal] = useState(false)
  const [showDateSelection, setShowDateSelection] = useState(false)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [catTexts, setCatTexts] = useState(["Meow, catch the light", "Haha... too slow", "Need some help?"])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }, [])

  const sendEmail = (date: Date) => {
    console.log("Attempting to send email for date:", date)
    if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
      console.log("Email simulation: Date confirmed for", date.toLocaleDateString())
      return
    }

    const templateParams = {
      to_name: "Bubbah",
      from_name: "Bugsy (Valentine)",
      message: `The date is CONFIRMED for: ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
    }

    console.log("Sending with params:", templateParams)

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log('EMAIL SUCCESS!', response.status, response.text);
        return response;
      }, (err) => {
        console.error('EMAIL FAILED...', err);
        throw err;
      });
  }

  function handleGetStarted() {
    if (audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.play().catch(e => console.log("Audio play failed", e))
      fadeIn(audioRef.current)
      setEnabled(true)
    }

    setTimeout(() => {
      setStarted(true)
      setCatTexts(NORMAL_CAT_TEXTS)
    }, 1000)
  }

  const maskState = useRef({ x: 85, y: 75, radius: 150 })

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const applyMask = () => {
      if (!overlay) return
      const { x, y, radius } = maskState.current
      const maskValue = `radial-gradient(circle at ${x}% ${y}%, transparent 0 ${radius}px, black ${radius + 30}px)`
      overlay.style.maskImage = maskValue
      overlay.style.webkitMaskImage = maskValue
    }

    const moveTl = gsap.timeline({ repeat: -1, yoyo: true })
    moveTl.to(maskState.current, { x: 20, y: 20, duration: 4, ease: "sine.inOut" })
      .to(maskState.current, { x: 80, y: 30, duration: 5, ease: "sine.inOut" })
      .to(maskState.current, { x: 15, y: 85, duration: 4, ease: "sine.inOut" })
      .to(maskState.current, { x: 50, y: 50, duration: 3, ease: "sine.inOut" })
      .to(maskState.current, { x: 85, y: 75, duration: 4, ease: "sine.inOut" })

    const pulseTween = gsap.to(maskState.current, {
      radius: 170,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    const checkClick = (e: MouseEvent) => {
      if (!overlay) return
      const rect = overlay.getBoundingClientRect()
      const centerX = (maskState.current.x / 100) * rect.width
      const centerY = (maskState.current.y / 100) * rect.height
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)

      if (dist < maskState.current.radius) {
        moveTl.kill()
        pulseTween.kill()
        gsap.to(maskState.current, {
          radius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
          duration: 1.5,
          ease: "power2.out",
          overwrite: true
        })
        window.removeEventListener("click", checkClick)
        handleGetStarted()
      }
    }

    gsap.ticker.add(applyMask)
    window.addEventListener("click", checkClick)

    return () => {
      moveTl.kill()
      pulseTween.kill()
      gsap.ticker.remove(applyMask)
      window.removeEventListener("click", checkClick)
    }
  }, [])

  const handleContinueToDate = () => {
    console.log("handleContinueToDate called - switching state immediately")
    setShowDateSelection(true)
  }

  return (
    <main className="h-screen min-w-screen bg-linear-to-br from-pink-50 to-pink-100 flex flex-col items-center relative overflow-hidden">
      {isMobile && <MobileView />}
      <div
        ref={overlayRef}
        className="overlay absolute inset-0 bg-black/50 z-50 backdrop-blur-md pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle at 85% 75%, transparent 0 150px, black 180px)`,
          WebkitMaskImage: `radial-gradient(circle at 85% 70%, transparent 0 150px, black 180px)`
        }}
      />

      <audio
        className="hidden"
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/dexter_intro.mp3`}
        autoPlay
        muted
        onEnded={() => {
          setEnabled(true)
          if (!started) setStarted(true)
          console.log("Audio ended, showing proposal...")
          setShowProposal(true)
        }}
      />

      <div className="flex items-start justify-start absolute top-0 left-0">
        <div className="w-85">
          <Lottie animationData={heartAnimation} loop autoplay />
        </div>
      </div>
      {/* <div className="flex items-start justify-start absolute top-[20px] right-[20px]">
        <PersonalPill name="Alice Wanini" imageSrc={`${import.meta.env.BASE_URL}images/alice.jpeg`} />
      </div> */}

      <MusicToggle
        audioRef={audioRef as any}
        enabled={enabled}
        onToggle={(isPlaying) => {
          if (isPlaying) setStarted(true)
        }}
      />

      <section ref={containerRef} className="w-full h-full max-w-3xl space-y-8 flex flex-col items-center justify-center p-4">
        {!started ? (
          <SplitText
            text="To Alice Wanini,"
            className="text-4xl sm:text-5xl font-semibold text-rose-900 leading-tight cherry-font"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
            tag="h1"
          />
        ) : !showProposal ? (
          <TextType
            key="main"
            text={["Hey Bugsy", "", "Aheeeem ...", "", "so I had a thought", "", "this could’ve been a text", "", "but here we are"]}
            className="text-4xl sm:text-5xl font-semibold text-rose-900 leading-tight cherry-font text-center"
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            cursorBlinkDuration={0.5}
            loop={false}
            onGlobalComplete={() => {
              console.log("Typing complete, waiting for audio...")
            }}
          />
        ) : !showDateSelection ? (
          <div className="proposal-card-container w-full flex justify-center relative z-10">
            <ProposalCard
              question="Will you be my Valentine?"
              successQuestion="Yay! I knew it! ❤️"
              yesAudio={`${import.meta.env.BASE_URL}audio/shrek.mp3`}
              noAudios={[
                `${import.meta.env.BASE_URL}audio/dexter_ending.mp3`,
                `${import.meta.env.BASE_URL}audio/minion.mp3`,
                `${import.meta.env.BASE_URL}audio/change.mp3`
              ]}
              onContinue={handleContinueToDate}
            />
          </div>
        ) : !showFinalMessage ? (
          <div key="date-selection" className="date-card-container w-full flex justify-center relative z-10 min-h-[400px]">
            <DateSelectionCard
              onDateSelected={async (date) => {
                setSelectedDate(date)
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ["#ff577f", "#ffc764", "#cdb4db"]
                })

                try {
                  await sendEmail(date)
                  setTimeout(() => setShowFinalMessage(true), 2000)
                } catch (error) {
                  console.error("Failed to send email:", error)
                  alert("Date confirmed locally, but notification failed to send. Please check your EmailJS settings.")
                  // Still show the final message so the UI doesn't get stuck
                  setTimeout(() => setShowFinalMessage(true), 2000)
                }
              }}
            />
          </div>
        ) : (
          <div className="final-message-container w-full flex justify-center relative z-10">
            <SuccessCard date={selectedDate} />
          </div>
        )}
      </section>

      <div className="w-110 absolute bottom-0 right-0 z-100 pointer-events-none">
        <ThinkingCat texts={catTexts} />
      </div>
    </main>
  )
}

function fadeIn(audio: HTMLAudioElement) {
  let volume = 0
  const interval = setInterval(() => {
    volume += 0.02
    audio.volume = Math.min(volume, 0.8)
    if (volume >= 0.8) clearInterval(interval)
  }, 100)
}