export default function RetroButton({ children, onClick, disabled = false, className = '' }) {
  const baseStyles =
    'w-full rounded border-2 px-8 py-4 text-lg font-bold uppercase tracking-widest transition md:w-auto'
  const activeStyles =
    'border-lime-300 bg-lime-900/50 text-lime-200 shadow-[0_0_16px_rgba(132,204,22,0.35)] hover:bg-lime-800/60'
  const disabledStyles = 'cursor-not-allowed border-slate-600 bg-slate-900 text-slate-500'

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${baseStyles} ${disabled ? disabledStyles : activeStyles} ${className}`}>
      {children}
    </button>
  )
}
