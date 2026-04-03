export default function TerminalWindow({ children }) {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg border border-lime-400/60 bg-slate-900 p-4 shadow-[0_0_20px_rgba(132,204,22,0.35)] md:p-8">
      <div className="mb-4 flex gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
      </div>
      {children}
    </div>
  )
}
