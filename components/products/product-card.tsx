import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductCardProps {
  id?: string
  name: string
  price: number
  image: string
  tags?: string[]
}

const ProductCard = ({ id = "1", name, price, image, tags = [] }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-md">
      <Link href={`/product/${id}`}>
        <div className="relative h-[240px] bg-gray-50">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-4" />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium mb-2 group-hover:text-brand-red transition-colors">{name}</h3>
        </Link>
        <p className="font-bold text-lg">₦{price.toLocaleString()}</p>

        <Tabs defaultValue="camry" className="mt-2">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="camry" className="text-xs">
              Camry
            </TabsTrigger>
            <TabsTrigger value="interior" className="text-xs">
              Interior
            </TabsTrigger>
            <TabsTrigger value="salon" className="text-xs">
              Salon
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full">
          <Button className="flex-1 gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
          <Button size="icon" variant="outline">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard

