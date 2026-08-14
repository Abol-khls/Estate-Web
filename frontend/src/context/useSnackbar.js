import { useContext } from "react";

import { SnackbarContext } from "./snackbarContextValue";

export function useSnackbar() {

    return useContext(SnackbarContext);

}