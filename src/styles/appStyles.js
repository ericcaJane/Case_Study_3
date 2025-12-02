
// =================== ENHANCED STYLES ===================
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  maxWidth: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // Enhanced Hero Section with Glass Morphism
  heroCard: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: "32px",
    overflow: "hidden",
    marginBottom: "32px",
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },

 heroOverlay: {
  background: `
    linear-gradient(135deg, 
      rgba(254, 243, 199, 0.08) 0%, 
      rgba(253, 230, 138, 0.06) 50%,
      rgba(252, 211, 77, 0.08) 100%
    )
  `,
  padding: "56px",
  position: "relative",
},

  heroContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
  },

  heroText: {
    flex: "1",
    minWidth: "320px",
  },

  heroTitle: {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: "900",
    color: "#0F172A",
    margin: "0 0 20px 0",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "linear-gradient(135deg, #FFC107 30%, #FFB300 80%, #FFA000 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
  },

  heroSubtitle: {
    color: "#475569",
    fontSize: "clamp(16px, 3vw, 20px)",
    margin: 0,
    lineHeight: "1.6",
    fontWeight: "500",
    maxWidth: "600px",
  },

  // Enhanced Stats Grid with Micro-animations
statsGrid: {
  display: "flex",
  gap: "24px",
  flexWrap: "wrap",       // ✅ allows wrapping on smaller screens
  alignItems: "stretch",
  justifyContent: "flex-start", // or "center" or "space-between"
},



statCard: {
  background: "rgba(255, 255, 255, 0.4)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "28px",
  display: "flex",
  flexDirection: "column", // stack icon + content
  alignItems: "center",     // center everything
  textAlign: "center",
  gap: "16px",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6)
  `,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  transform: "translateY(0)",
},


statIcon: {
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #FFC107 30%, #FFB300 80%, #FFA000 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "22px",
  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
},


statContent: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // center number + label
},


  statNumber: {
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 6px 0",
    lineHeight: "1",
  },

  statLabel: {
    fontSize: "12px",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: "600",
    margin: 0,
  },

  // Enhanced Card Styles
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "24px",
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
    padding: "36px",
    marginBottom: "28px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },

  selectorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "24px",
    boxShadow: `
      0 16px 32px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.8)
    `,
    padding: "28px",
    marginBottom: "28px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },

  selectorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "24px",
  },

  // Enhanced Radio Groups
  radioGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: "16px 24px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "15px",
    fontWeight: "600",
    color: "#475569",
    position: "relative",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    transform: "translateY(0)",
  },

  radioInput: {
    display: "none",
  },

  radioCustom: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #CBD5E1",
    marginRight: "14px",
    position: "relative",
    transition: "all 0.3s ease",
    background: "white",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  cardHeader: {
    marginBottom: "32px",
    position: "relative",
  },

  cardTitle: {
    fontSize: "clamp(20px, 4vw, 26px)",
    fontWeight: "800",
    color: "#0F172A",
    margin: "0 0 10px 0",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    lineHeight: "1.3",
  },

  cardSubtitle: {
    color: "#64748B",
    fontSize: "15px",
    margin: 0,
    fontWeight: "500",
    lineHeight: "1.5",
  },

  // Enhanced Form Styles
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "10px",
    textTransform: "capitalize",
    letterSpacing: "0.3px",
  },

  input: {
    padding: "16px 20px",
    border: "2px solid rgba(203, 213, 225, 0.6)",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    "&:focus": {
      borderColor: "#3B82F6",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
      transform: "translateY(-1px)",
    }
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.1)",
  },

  errorText: {
    fontSize: "12px",
    color: "#EF4444",
    marginTop: "8px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  // Enhanced Button Styles
  primaryButton: {
     background: "linear-gradient(135deg, #FFC107 30%, #FFB300 80%, #FFA000 100%)",
    color: "white",
    padding: "18px 28px",
    border: "none",
    borderRadius: "16px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `
      0 8px 24px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    alignSelf: "flex-start",
    position: "relative",
    overflow: "hidden",
    transform: "translateY(0)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `
        0 12px 32px rgba(59, 130, 246, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
    },
    "&:active": {
      transform: "translateY(0)",
    }
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none !important",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  // Enhanced Table Styles
  tableContainer: {
    overflowX: "auto",
    borderRadius: "20px",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  th: {
    backgroundColor: "rgba(248, 250, 252, 0.9)",
    backdropFilter: "blur(8px)",
    padding: "20px 18px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "800",
    color: "#1E293B",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  td: {
    padding: "18px",
    borderBottom: "1px solid rgba(241, 245, 249, 0.8)",
    color: "#475569",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },

  tableRow: {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    }
  },

  totalCell: {
    padding: "18px",
    borderBottom: "1px solid rgba(241, 245, 249, 0.8)",
    fontWeight: "800",
    color: "#3B82F6",
    background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 179, 0, 0.05) 100%)",
    backdropFilter: "blur(8px)",
    position: "relative",
  },

  actionButton: {
    background: "rgba(255, 255, 255, 0.8)",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "10px",
    marginRight: "6px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    }
  },

  tableInput: {
    width: "100px",
    padding: "10px 14px",
    border: "2px solid rgba(203, 213, 225, 0.6)",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    fontWeight: "500",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#3B82F6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    }
  },

  // Enhanced Empty States
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#64748B",
  },

  emptyStateIcon: {
    margin: "0 auto 24px",
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(226, 232, 240, 0.6) 0%, rgba(241, 245, 249, 0.8) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94A3B8",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },

  emptyStateTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1E293B",
    margin: "0 0 16px 0",
  },

  emptyStateText: {
    fontSize: "15px",
    color: "#64748B",
    margin: 0,
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6",
  },

  // Enhanced Upload Card
  uploadCard: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "24px",
    boxShadow: "0 16px 32px rgba(0, 0, 0, 0.06)",
    padding: "32px",
    marginBottom: "28px",
    border: "2px dashed rgba(99, 102, 241, 0.3)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      borderColor: "rgba(99, 102, 241, 0.5)",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      transform: "translateY(-2px)",
    }
  },

  uploadHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: "20px",
  },

  fileInput: {
    width: "100%",
    padding: "20px",
    border: "2px solid rgba(203, 213, 225, 0.6)",
    borderRadius: "16px",
    fontSize: "15px",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "500",
    color: "#475569",
    "&:hover": {
      borderColor: "#3B82F6",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
    }
  },

  // Enhanced Visualization Grid
  visualizationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  vizButton: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px 24px",
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(16px)",
    border: "2px solid rgba(226, 232, 240, 0.6)",
    borderRadius: "18px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "15px",
    fontWeight: "600",
    color: "#475569",
    textAlign: "left",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    transform: "translateY(0)",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    }
  },

  vizButtonActive: {
    background: "linear-gradient(135deg, #FFC107 30%, #FFB300 80%, #FFA000 100%)",
    color: "white",
    borderColor: "transparent",
    boxShadow: `
      0 12px 32px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transform: "translateY(-4px)",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: `
        0 16px 40px rgba(59, 130, 246, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
    }
  },

  // Enhanced Chart Styles
  chartCard: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: "28px",
    boxShadow: `
      0 24px 48px rgba(0, 0, 0, 0.08),
      0 0 0 1px rgba(255, 255, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
    padding: "40px",
    marginBottom: "32px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
  },

  chartContainer: {
    height: "520px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    padding: "28px",
    overflow: "hidden",
    position: "relative",
  },

  chartEmpty: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748B",
    fontSize: "16px",
    fontWeight: "600",
    gap: "12px",
  },

  // Enhanced Heatmap Styles
  heatmapContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  heatmapTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: "32px",
    textAlign: "center",
   background: "linear-gradient(135deg, #FFC107 30%, #FFB300 80%, #FFA000 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  yAxisLabels: {
    minWidth: "140px",
    textAlign: "right",
    paddingRight: "16px",
    fontWeight: 700,
    color: "#1E293B",
  },

  yAxisLabel: {
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  heatmapWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "8px",
  },

  heatmapScroll: {
    display: "inline-block",
    minWidth: "max-content",
  },

  // Responsive breakpoints
  "@media (max-width: 768px)": {
    heroOverlay: {
      padding: "32px 24px",
    },
    heroContent: {
      flexDirection: "column",
      gap: "24px",
    },
    statsGrid: {
      gridTemplateColumns: "1fr",
    },
    radioGroup: {
      gridTemplateColumns: "1fr",
    },
    visualizationGrid: {
      gridTemplateColumns: "1fr",
    },
    formGrid: {
      gridTemplateColumns: "1fr",
    }
  },

  "@media (max-width: 480px)": {
    container: {
      padding: "16px",
    },
    card: {
      padding: "24px",
    },
    heroOverlay: {
      padding: "24px",
    }
  }
};

export default styles;