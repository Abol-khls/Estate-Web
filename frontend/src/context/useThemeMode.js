import { useContext } from "react";

import { ThemeModeContext } from "./themeModeContextValue";

export function useThemeMode() {

    return useContext(ThemeModeContext);

}