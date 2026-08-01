import { createTheme } from "@mui/material/styles";

import { lightTokens, darkTokens, fontSans, fontMono } from "./tokens";

export default function getTheme(mode) {

    const tokens = mode === "dark" ? darkTokens : lightTokens;

    const theme = createTheme({

        direction: "rtl",

        palette: {
            mode,

            primary: {
                main: tokens.accentMain,
                light: tokens.accentLight,
                dark: tokens.accentDark,
                contrastText: tokens.accentContrastText,
            },

            secondary: {
                main: tokens.accentMain,
                light: tokens.accentLight,
                dark: tokens.accentDark,
                contrastText: tokens.accentContrastText,
            },

            error: {
                main: tokens.error,
            },

            success: {
                main: tokens.success,
            },

            warning: {
                main: tokens.warning,
            },

            background: {
                default: tokens.bg,
                paper: tokens.surface,
            },

            text: {
                primary: tokens.textPrimary,
                secondary: tokens.textSecondary,
            },

            divider: tokens.border,
        },

        custom: {
            surfaceAlt: tokens.surfaceAlt,
            textMuted: tokens.textMuted,
            accentTint: tokens.accentTint,
            fontMono,
            status: {
                available: { bg: tokens.successBg, text: tokens.success },
                reserved: { bg: tokens.warningBg, text: tokens.warning },
                sold: { bg: tokens.neutralStatusBg, text: tokens.neutralStatus },
                rented: { bg: tokens.neutralStatusBg, text: tokens.neutralStatus },
            },
            darkAnchorBg: darkTokens.bg,
            darkAnchorGlow: "rgba(220, 172, 91, 0.15)",
            sidebar: {
                bg: darkTokens.bg,
                text: "rgba(243, 241, 234, 0.72)",
                textActive: darkTokens.accentContrastText,
                hoverBg: "rgba(255, 255, 255, 0.06)",
                activeBg: darkTokens.accentMain,
                border: darkTokens.border,
                logoDot: darkTokens.accentMain,
            },
        },

        typography: {
            fontFamily: fontSans,

            h4: { fontWeight: 800, letterSpacing: "-0.02em" },
            h5: { fontWeight: 700 },
            h6: { fontWeight: 700 },
            subtitle1: { fontWeight: 600 },
            button: { fontWeight: 600 },
        },

        shape: {
            borderRadius: 12,
        },

        components: {

            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: tokens.bg,
                        transition: "background-color .2s ease",
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },

            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        textTransform: "none",
                        fontWeight: 600,
                        paddingInline: 20,
                        paddingBlock: 10,
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                    },
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        backgroundColor: tokens.surface,
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        fontWeight: 600,
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: `1px solid ${tokens.border}`,
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        fontSize: 12,
                        borderRadius: 8,
                    },
                },
            },

        },

    });

    return theme;

}