import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-black text-white shadow-md  items-center">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200">
          <Image src="/my-image.png" alt="KChido Logo" width={100} height={100} className="object-contain" />
          <div className="flex flex-col leading-tight">
        <span className="text-2xl font-bold">KChido</span>
        <span className="text-sm text-gray-300">¡Participa y gana!</span>
      </div>
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#00d65e] hover:bg-[#00c054] text-black font-medium transition-all duration-200"
              >
                <span>Sorteos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
