import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export default function useResourceList(resource, params, options = {}) {

    return useQuery({

        queryKey: [resource, "list", params],

        queryFn: async () => {

            const response = await api.get(`${resource}/`, { params });

            return response.data;

        },

        ...options,

    });

}