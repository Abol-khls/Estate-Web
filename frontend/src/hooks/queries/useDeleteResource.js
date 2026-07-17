import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function useDeleteResource(resource) {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: async (id) => {

            await api.delete(`${resource}/${id}/`);

        },

        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: [resource, "list"] });

        },

    });

}