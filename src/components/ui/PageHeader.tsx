interface Props {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle && <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}
