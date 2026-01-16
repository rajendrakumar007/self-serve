import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Svg,
  Path,
  Image,
} from "@react-pdf/renderer";
import { getCurrentUserId } from "../../utils/auth/auth.js";
import axiosClient from "../../services/axiosClient.js";
import { FaDownload } from "react-icons/fa";

export default function GeneratePDF({
  data,
  fileName,
  logoSrc,
  userName,
  title = "DOCUMENT",
  subtitle = "Summary",
  sections = [],
}) {
  // Expect a complete data object
  const safeData = data || {};

  // Current user details
  const [userFullName, setUserFullName] = useState(userName || "-");
  const [userIdForPdf, setUserIdForPdf] = useState(null);

  useEffect(() => {
    // If userName was provided as a prop, use it and skip fetch
    if (userName && userName.trim()) {
      setUserFullName(userName.trim());
    }

    const id = getCurrentUserId();
    setUserIdForPdf(id);

    // If we already have a userName, only set the ID; otherwise fetch name
    if (!id || (userName && userName.trim())) return;

    let mounted = true;

    (async () => {
      try {
        const res = await axiosClient.get(`/users`);
        const arr = Array.isArray(res.data) ? res.data : [];
        const me = arr.find((u) => (u.userId ?? u.id) === id) || null;

        const first = me?.contact?.firstName ?? me?.firstName ?? "";
        const last = me?.contact?.lastName ?? me?.lastName ?? "";

        const fullName = `${first} ${last}`.trim() || "-";
        if (mounted) setUserFullName(fullName);
      } catch {
        if (mounted) setUserFullName("-");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userName]);

  const formatDateTimeIST = (d) =>
    new Date(d).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const generatedAt = formatDateTimeIST(Date.now());

  const formatINR = (v) =>
    typeof v === "number"
      ? v.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : Number(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "-" : dt.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 32,
      fontSize: 11,
      fontFamily: "Helvetica",
      color: "#111827",
    },
    headerWrap: {
      marginBottom: 14,
      alignItems: "center",
      textAlign: "center",
    },
    reportTitle: {
      fontSize: 18,
      color: "#1F2937",
      fontWeight: 700,
    },
    reportSubtitle: {
      marginTop: 4,
      fontSize: 11,
      color: "#6B7280",
    },
    hrLight: {
      marginTop: 10,
      height: 1,
      backgroundColor: "#E5E7EB",
    },
    section: {
      marginTop: 16,
    },
    sectionHeaderBar: {
      backgroundColor: "#1C64F2",
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    sectionHeaderText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: 700,
    },
    sectionBodyCard: {
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: "#FFFFFF",
    },
    row: {
      flexDirection: "row",
      marginBottom: 6,
    },
    label: {
      width: "35%",
      color: "#000000",
      fontWeight: 800,
    },
    colon: {
      width: "5%",
      color: "#6B7280",
    },
    value: {
      width: "60%",
      color: "#111827",
      fontWeight: 400,
    },
    blockLabel: {
      color: "#374151",
      marginBottom: 4,
      fontWeight: 700,
    },
    blockText: {
      lineHeight: 1.6,
      color: "#111827",
    },
    listItem: {
      marginBottom: 4,
    },
    pageFooter: {
      position: "absolute",
      bottom: 18,
      left: 32,
      right: 32,
      fontSize: 9,
      color: "#6B7280",
      textAlign: "right",
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    brandIcon: {
      width: 14,
      height: 14,
      marginRight: 6,
    },
    brandText: {
      fontSize: 14,
      color: "#1C64F2",
      fontWeight: 700,
      letterSpacing: 0.5,
    },
  });

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeaderBar}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
      <View style={styles.sectionBodyCard}>{children}</View>
    </View>
  );

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const GeneratedPDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with SELFSERVE Branding */}
        <View style={styles.headerWrap}>
          <View style={styles.brandRow}>
            {logoSrc ? (
              <Image style={styles.brandIcon} source={logoSrc} />
            ) : (
              <Svg viewBox="0 0 24 24" style={styles.brandIcon}>
                <Path
                  d="M12 2l7 3v6c0 5-3.5 9.3-7 10-3.5-.7-7-5-7-10V5l7-3z"
                  fill="#1C64F2"
                />
              </Svg>
            )}
            <Text style={styles.brandText}>SELFSERVE</Text>
          </View>

          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.hrLight} />

        {/* Dynamic Sections */}
        {Array.isArray(sections) && sections.length > 0 ? (
          sections.map((section, idx) => (
            <Section key={idx} title={section.title}>
              {section.type === "rows" && Array.isArray(section.data) ? (
                section.data.map((row, rowIdx) => (
                  <Row key={rowIdx} label={row.label} value={row.value} />
                ))
              ) : section.type === "list" && Array.isArray(section.data) ? (
                section.data.map((item, itemIdx) => (
                  <Text key={itemIdx} style={styles.listItem}>
                    {`• ${item}`}
                  </Text>
                ))
              ) : section.type === "text" ? (
                <Text style={styles.blockText}>{section.data}</Text>
              ) : section.type === "block" ? (
                <>
                  <Text style={styles.blockLabel}>{section.label}</Text>
                  <Text style={styles.blockText}>{section.data}</Text>
                </>
              ) : null}
            </Section>
          ))
        ) : (
          <Section title="INFORMATION">
            <Row label="Full Name" value={userFullName} />
            <Row label="User ID" value={userIdForPdf ?? "-"} />
            <Row label="Generated Date" value={formatDate(Date.now())} />
          </Section>
        )}

        {/* Footer with timestamp */}
        <View style={styles.pageFooter}>
          <Text>Generated on {generatedAt} (IST)</Text>
        </View>
      </Page>
    </Document>
  );

  const resolvedFileName = fileName || "document.pdf";

  return (
    <PDFDownloadLink
      document={GeneratedPDF}
      fileName={resolvedFileName}
      className="inline-flex items-center px-3 py-1.5 text-sm gap-1.5 rounded-md border border-primary text-primary bg-bgCard shadow-xs hover:bg-bgHover hover:text-primaryDark hover:border-primaryDark transition"
    >
      {({ blob, url, loading, error }) => (
        <>
          <FaDownload />
          {loading ? "Generating..." : "Download"}
        </>
      )}
    </PDFDownloadLink>
  );
}
