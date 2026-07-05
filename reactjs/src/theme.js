import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#4f46e5",
            light: "#818cf8",
            dark: "#3730a3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#0d9488",
            light: "#5eead4",
            dark: "#0f766e",
        },
        error: {
            main: "#e11d48",
        },
        success: {
            main: "#16a34a",
        },
        background: {
            default: "#f4f5fb",
            paper: "#ffffff",
        },
        text: {
            primary: "#1e1b3a",
            secondary: "#635f7a",
        },
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif",
        ].join(","),
        h1: { fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700 },
        h2: { fontSize: "clamp(1.15rem, 2.6vw, 1.5rem)", fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    transition: "background-color 200ms ease",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #0d9488 130%)",
                    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.25)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: "box-shadow 220ms ease, transform 220ms ease",
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: "1px solid rgba(79, 70, 229, 0.08)",
                    boxShadow: "0 2px 10px rgba(30, 27, 58, 0.06)",
                    transition: "transform 220ms ease, box-shadow 220ms ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 28px rgba(30, 27, 58, 0.12)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
                    "&:hover": {
                        transform: "translateY(-1px)",
                    },
                    "&:active": {
                        transform: "translateY(0)",
                    },
                },
                contained: {
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                    "&:hover": {
                        boxShadow: "0 6px 16px rgba(79, 70, 229, 0.35)",
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: "transform 150ms ease, background-color 150ms ease",
                    "&:hover": {
                        transform: "scale(1.08)",
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    margin: "2px 8px",
                    width: "auto",
                    transition: "background-color 150ms ease, padding-left 150ms ease",
                    "&:hover": {
                        paddingLeft: 20,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: "background-color 150ms ease",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 700,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "box-shadow 150ms ease, border-color 150ms ease",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 18,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
