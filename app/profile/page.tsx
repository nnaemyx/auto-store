"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import ProfileLayout from "@/components/profile/profile-layout"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/api/use-auth"

export default function ProfileOverviewPage() {
  const { updateUser, updateUserImage, isUpdating } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    phone_number: ""
  })
  const { user } = useAuth()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        phone_number: user.phone_number
      })
    }
  }, [user])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a temporary URL for the selected image
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      
      // Upload the image
      updateUserImage(file)
    }
  }

  // Clean up preview image URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(formData)
    setIsEditing(false)
  }

  // Breadcrumb for desktop
  const breadcrumb = (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-brand-red">
        Homepage
      </Link>
      {" / "}
      <span className="font-medium text-gray-700">Profile overview</span>
    </div>
  )

  return (
    <ProfileLayout>
      {!isMobile && breadcrumb}

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Profile</h2>
            {!isEditing ? (
              <Button variant="ghost" className="text-gray-500 text-sm" onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
            ) : (
              <Button variant="ghost" className="text-gray-500 text-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>

          <div className="p-4">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 rounded-full overflow-hidden">
                  <AvatarImage 
                    src={previewImage || user?.image || undefined} 
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-black/90"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Enter your phone number"
                    disabled={isUpdating}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phone_number}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Security</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
              </div>
              <Link href="/auth/change-password">
                <Button variant="outline" className="text-brand-red border-brand-red hover:bg-brand-red hover:text-white">
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

