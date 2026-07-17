import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function useToggleFavorite() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (propertyId) => {

            const response = await api.post(
                `properties/${propertyId}/toggle_favorite/`
            );

            return response.data;

        },

        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["properties"] });

        },

    });

}