"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useSubmitProductReview } from "@/hooks/use-product-reviews"
import { useToast } from "@/hooks/use-toast"

interface ProductReviewFormProps {
  productId: string
  userId: string
  onSuccess?: () => void
}

export default function ProductReviewForm({ productId, userId, onSuccess }: ProductReviewFormProps) {
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const { mutate: submitReview, isPending } = useSubmitProductReview()
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment for your review",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
      })
      return
    }

    submitReview(
      {
        product_id: productId,
        user_id: userId,
        comment: comment.trim(),
        rating,
      },
      {
        onSuccess: () => {
          setComment("")
          setRating(0)
          if (onSuccess) onSuccess()
        },
      }
    )
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {i <= (hoverRating || rating) ? (
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="h-6 w-6 text-gray-300" />
          )}
        </button>
      )
    }
    return stars
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Rating:</span>
        <div className="flex">{renderStars()}</div>
      </div>
      <Textarea
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSubmit} 
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  )
} 