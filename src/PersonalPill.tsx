type PersonalPillProps = {
  name: string
  imageSrc: string
}

export default function PersonalPill({ name, imageSrc }: PersonalPillProps) {
  return (
    <div
      className="
        inline-flex items-center gap-3
        rounded-full
        bg-white/70 backdrop-blur
        px-2 py-2 pr-8
        shadow-md
      "
    >
      <img
        src={imageSrc}
        alt={name}
        className="size-18 rounded-full shadow-lg object-cover"
      />

      <span className="text-xl font-medium text-rose-800">
        {name}
      </span>
    </div>
  )
}