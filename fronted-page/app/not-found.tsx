import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
        <p className="text-gray-600 mb-8">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
        <Link href="/mypage/raffles">
          <Button className="bg-[#00d65e] hover:bg-[#00c054] text-black">Volver a Sorteos</Button>
        </Link>
      </div>
    </>
  )
}
