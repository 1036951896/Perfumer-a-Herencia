interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onPaginaChange: (pagina: number) => void
  loading?: boolean
}

export function Paginacion({
  pagina,
  totalPaginas,
  onPaginaChange,
  loading = false,
}: PaginacionProps) {
  if (totalPaginas <= 1) return null

  const paginas = []
  const ventana = 2

  // Primera página
  if (pagina > ventana + 1) {
    paginas.push(1)
    if (pagina > ventana + 2) {
      paginas.push(-1) // Representar "..."
    }
  }

  // Ventana alrededor de la página actual
  for (
    let i = Math.max(1, pagina - ventana);
    i <= Math.min(totalPaginas, pagina + ventana);
    i++
  ) {
    if (!paginas.includes(i)) {
      paginas.push(i)
    }
  }

  // Última página
  if (pagina < totalPaginas - ventana - 1) {
    if (pagina < totalPaginas - ventana - 2) {
      paginas.push(-1) // Representar "..."
    }
    paginas.push(totalPaginas)
  }

  return (
    <div className="flex justify-center items-center gap-8 my-20">
      {/* Anterior */}
      <button
        onClick={() => onPaginaChange(pagina - 1)}
        disabled={pagina === 1 || loading}
        className="text-xs tracking-widest uppercase border-b border-dark/40 pb-1 hover:opacity-60 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>

      {/* Info */}
      <div className="text-xs tracking-wider text-dark/40">
        {pagina} / {totalPaginas}
      </div>

      {/* Siguiente */}
      <button
        onClick={() => onPaginaChange(pagina + 1)}
        disabled={pagina === totalPaginas || loading}
        className="text-xs tracking-widest uppercase border-b border-dark/40 pb-1 hover:opacity-60 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
    </div>
  )
}
