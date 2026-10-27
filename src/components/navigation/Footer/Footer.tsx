
export function Footer() {
  return (
    <footer className="py-4 px-6 text-sm text-text-muted border-t border-border mt-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p>© {new Date().getFullYear()} +PraClinic. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
