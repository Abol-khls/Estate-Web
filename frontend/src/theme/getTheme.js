import { createTheme, alpha } from "@mui/material/styles";

import { lightTokens, darkTokens, fontSans, fontMono } from "./tokens";

export default function getTheme(mode) {

    const tokens = mode === "dark" ? darkTokens : lightTokens;

    const tone = (color) => ({
        bg: alpha(color.main, 0.1),
        border: alpha(color.main, 0.25),
        text: color.text,
        main: color.main,
    });

    const theme = createTheme({

        direction: "rtl",

        palette: {
            mode,

            primary: {
                main: tokens.emerald.main,
                light: tokens.emerald.light,
                dark: tokens.emerald.dark,
                contrastText: "#ffffff",
            },

            secondary: {
                main: tokens.cyan.main,
                light: tokens.cyan.light,
                dark: tokens.cyan.dark,
                contrastText: "#ffffff",
            },

            info: {
                main: tokens.indigo.main,
                light: tokens.indigo.light,
                dark: tokens.indigo.dark,
                contrastText: "#ffffff",
            },

            error: {
                main: tokens.rose.main,
                light: tokens.rose.light,
                dark: tokens.rose.dark,
                contrastText: "#ffffff",
            },

            success: {
                main: tokens.emerald.main,
                light: tokens.emerald.light,
                dark: tokens.emerald.dark,
                contrastText: "#ffffff",
            },

            warning: {
                main: tokens.amber.main,
                light: tokens.amber.light,
                dark: tokens.amber.dark,
                contrastText: "#ffffff",
            },

            neutral: {
                main: tokens.slate.main,
                light: tokens.slate.light,
                dark: tokens.slate.dark,
                contrastText: "#ffffff",
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
            surfaceRaised: tokens.surfaceRaised,
            textMuted: tokens.textMuted,
            accentTint: alpha(tokens.emerald.main, 0.1),
            fontMono,
            pageGradient: tokens.pageGradient,
            borderStrong: tokens.borderStrong,
            glassBorder: tokens.glassBorder,
            glassBorderSoft: tokens.glassBorderSoft,
            glassPanel: tokens.glassPanel,
            inputBg: tokens.inputBg,
            brand: tokens.brand,
            brandDiag: tokens.brandDiag,
            brandText: tokens.brandText,
            glow: tokens.glow,
            hoverShadow: tokens.hoverShadow,
            cardShadow: tokens.cardShadow,
            popShadow: tokens.popShadow,
            tableHead: tokens.tableHead,
            rowHover: tokens.rowHover,
            overlay: tokens.overlay,
            hero: {
                bg: tokens.heroBg,
                border: tokens.heroBorder,
                text: tokens.heroText,
                sub: tokens.heroSub,
            },
            publicHeadBg: tokens.publicHeadBg,
            tones: {
                emerald: tone(tokens.emerald),
                cyan: tone(tokens.cyan),
                indigo: tone(tokens.indigo),
                amber: tone(tokens.amber),
                rose: tone(tokens.rose),
                slate: tone(tokens.slate),
            },
            status: {
                available: { bg: alpha(tokens.emerald.main, 0.12), text: tokens.emerald.text },
                reserved: { bg: alpha(tokens.amber.main, 0.12), text: tokens.amber.text },
                sold: { bg: alpha(tokens.slate.main, 0.15), text: tokens.slate.text },
            },
            darkAnchorBg: darkTokens.bg,
            darkAnchorGlow: "rgba(16, 185, 129, 0.16)",
            sidebar: {
                bg: tokens.sidebarBg,
                text: "#94a3b8",
                textActive: darkTokens.emerald.text,
                hoverBg: "rgba(30, 41, 59, 0.5)",
                activeBg: "rgba(16, 185, 129, 0.1)",
                activeBorder: "rgba(16, 185, 129, 0.2)",
                border: "rgba(30, 41, 59, 0.8)",
                logoDot: darkTokens.emerald.main,
            },
        },

        typography: {
            fontFamily: fontSans,

            h4: { fontWeight: 800 },
            h5: { fontWeight: 700 },
            h6: { fontWeight: 700 },
            subtitle1: { fontWeight: 600 },
            button: { fontWeight: 600 },
        },

        shape: {
            borderRadius: 4,
        },

        components: {

            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: tokens.bg,
                        backgroundImage: tokens.pageGradient,
                        backgroundAttachment: "fixed",
                        transition: "background-color .2s ease",
                        scrollbarWidth: "thin",
                        scrollbarColor: `${tokens.borderStrong} transparent`,
                    },
                    "*": {
                        scrollbarWidth: "thin",
                        scrollbarColor: `${tokens.borderStrong} transparent`,
                    },
                    "*::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "*::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: tokens.borderStrong,
                        borderRadius: 4,
                    },
                    "*::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: tokens.emerald.main,
                    },
                    "*::-webkit-scrollbar-corner": {
                        backgroundColor: "transparent",
                    },
                    ".recharts-cartesian-grid line": {
                        stroke: tokens.border,
                    },
                    ".recharts-text, .recharts-legend-item-text": {
                        fill: `${tokens.textSecondary} !important`,
                        color: `${tokens.textSecondary} !important`,
                        fontFamily: fontSans,
                    },
                    ".recharts-default-tooltip": {
                        backgroundColor: `${tokens.surfaceAlt} !important`,
                        border: `1px solid ${tokens.borderStrong} !important`,
                        borderRadius: 12,
                        color: tokens.textPrimary,
                    },
                    ".recharts-tooltip-cursor": {
                        fill: alpha(tokens.emerald.main, 0.06),
                    },
                    "::selection": {
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                    },
                    "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active": {
                        WebkitBoxShadow: `0 0 0 100px ${tokens.surfaceAlt} inset !important`,
                        WebkitTextFillColor: `${tokens.textPrimary} !important`,
                        caretColor: `${tokens.textPrimary} !important`,
                        borderRadius: "inherit",
                        transition: "background-color 5000s ease-in-out 0s !important",
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
                        borderRadius: 12,
                        textTransform: "none",
                        fontWeight: 600,
                        paddingInline: 20,
                        paddingBlock: 9,
                        transition: "all .2s ease",
                    },
                    containedPrimary: {
                        background: tokens.brand,
                        boxShadow: tokens.glow,
                        "&:hover": {
                            background: tokens.brand,
                            opacity: 0.93,
                            boxShadow: tokens.glow,
                        },
                        "&.Mui-disabled": {
                            background: tokens.border,
                            boxShadow: "none",
                            color: tokens.textMuted,
                        },
                    },
                    outlined: {
                        color: tokens.textPrimary,
                        borderColor: tokens.borderStrong,
                        backgroundColor: alpha(tokens.surfaceAlt, 0.4),
                        "&:hover": {
                            borderColor: tokens.emerald.main,
                            backgroundColor: alpha(tokens.emerald.main, 0.08),
                        },
                    },
                    outlinedPrimary: {
                        color: tokens.textPrimary,
                        borderColor: tokens.borderStrong,
                    },
                    outlinedError: {
                        color: tokens.rose.text,
                        borderColor: alpha(tokens.rose.main, 0.4),
                        "&:hover": {
                            borderColor: tokens.rose.main,
                            backgroundColor: alpha(tokens.rose.main, 0.08),
                        },
                    },
                    textPrimary: {
                        color: tokens.emerald.text,
                        "&:hover": {
                            backgroundColor: alpha(tokens.emerald.main, 0.08),
                        },
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        transition: "all .2s ease",
                    },
                },
            },

            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        backgroundColor: tokens.inputBg,
                        transition: "all .2s ease",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(tokens.borderStrong, 0.8),
                            transition: "all .2s ease",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: tokens.textMuted,
                        },
                        "&.Mui-focused": {
                            boxShadow: `0 0 0 3px ${alpha(tokens.emerald.main, 0.15)}`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: tokens.emerald.main,
                            borderWidth: 1,
                        },
                    },
                },
            },

            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        "&.Mui-focused": {
                            color: tokens.emerald.text,
                        },
                    },
                },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 999,
                        fontWeight: 600,
                    },
                    outlined: {
                        borderColor: tokens.border,
                        color: tokens.textSecondary,
                    },
                },
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: `1px solid ${tokens.glassBorderSoft}`,
                        boxShadow: tokens.cardShadow,
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 20,
                        backgroundColor: tokens.surfaceAlt,
                        border: `1px solid ${tokens.borderStrong}`,
                    },
                },
            },

            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                        backgroundColor: tokens.surfaceAlt,
                        border: `1px solid ${tokens.borderStrong}`,
                        boxShadow: tokens.popShadow,
                    },
                },
            },

            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 12,
                        backgroundColor: tokens.surfaceAlt,
                        border: `1px solid ${tokens.borderStrong}`,
                    },
                },
            },

            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor: tokens.overlay,
                        backdropFilter: "blur(4px)",
                        "&.MuiBackdrop-invisible": {
                            backgroundColor: "transparent",
                            backdropFilter: "none",
                        },
                    },
                },
            },

            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: darkTokens.surfaceAlt,
                        backgroundImage: "none",
                    },
                },
            },

            MuiPaginationItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        borderColor: tokens.borderStrong,
                        color: tokens.textSecondary,
                        fontWeight: 500,
                        "&.Mui-selected": {
                            backgroundColor: alpha(tokens.emerald.main, 0.15),
                            border: `1px solid ${alpha(tokens.emerald.main, 0.4)}`,
                            color: tokens.emerald.text,
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: alpha(tokens.emerald.main, 0.22),
                            },
                        },
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        fontSize: 12,
                        borderRadius: 8,
                        backgroundColor: darkTokens.surfaceAlt,
                        border: `1px solid ${darkTokens.borderStrong}`,
                        color: darkTokens.textPrimary,
                    },
                },
            },

            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 600,
                        "&.Mui-selected": {
                            color: tokens.emerald.text,
                        },
                    },
                },
            },

            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        background: tokens.brand,
                        height: 3,
                        borderRadius: 3,
                    },
                },
            },

            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        borderRadius: 999,
                        backgroundColor: alpha(tokens.emerald.main, 0.15),
                    },
                    bar: {
                        background: tokens.brand,
                        borderRadius: 999,
                    },
                },
            },

            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    },
                },
            },

            MuiSkeleton: {
                styleOverrides: {
                    root: {
                        backgroundColor: alpha(tokens.textMuted, 0.15),
                    },
                },
            },

        },

    });

    return theme;

}