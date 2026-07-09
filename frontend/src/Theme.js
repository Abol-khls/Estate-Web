import { createTheme } from "@mui/material/styles";


const theme = createTheme({

    direction: "rtl",

    palette: {
        mode: "light",

        primary: {
            main: "#1F3B57",
            light: "#2C5480",
            dark: "#122536",
            contrastText: "#FFFFFF",
        },

        secondary: {
            main: "#C89B3C",
            light: "#DAB768",
            dark: "#A17E2B",
            contrastText: "#1A2233",
        },

        error: {
            main: "#D64545",
        },

        success: {
            main: "#2F9E44",
        },

        background: {
            default: "#F4F6F8",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#1A2233",
            secondary: "#67707D",
        },

        divider: "#E4E7EB",
    },

    typography: {
        fontFamily: "'Vazirmatn', 'Roboto', sans-serif",

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
                    backgroundColor: "#F4F6F8",
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
                    backgroundColor: "#FFFFFF",
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

export default theme;