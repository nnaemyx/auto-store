import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { authApiClient } from "@/api/api-client-with-auth";

interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  image: string | null;
}

interface UpdateUserData {
  username: string;
  phone_number: string;
}

export function useUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      console.log("Updating user data:", data);
      const response = await authApiClient.post<User>(
        "/auth/user-update",
        data
      );
      console.log("Update user response:", response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user data",
      });
    },
  });

  const updateUserImageMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log("Updating user image...");
      const formData = new FormData();
      formData.append("image", file, file.name);

      console.log("FormData contents:", {
        image: formData.get("image"),
        filename: file.name,
        type: file.type,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user-update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }

      const data = await response.json();
      console.log("Update image response:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating image:", error);
      toast({
        title: "Error",
        description: "Failed to update profile image",
      });
    },
  });

  return {
    updateUser: updateUserMutation.mutate,
    updateUserImage: updateUserImageMutation.mutate,
    isUpdating:
      updateUserMutation.isPending || updateUserImageMutation.isPending,
  };
}
