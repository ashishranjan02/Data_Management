import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import

export const GuarantorPdf = (member, guarantorFor = [], hasGuarantors = []) => {
  if (!member) {
    console.warn("No member selected for PDF export");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // 🔹 Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(25, 118, 210);
  doc.text("Guarantor Information Report", 60, 15);

  // 🔸 Member Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Member Name: ${member.name}`, 15, 30);
  doc.text(`Member ID: ${member.id}`, 15, 38);

  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 118, 210);
  doc.text("Guarantor For:", 15, 50);

  if (Array.isArray(guarantorFor) && guarantorFor.length > 0) {
    autoTable(doc, {
      startY: 55,
      head: [["S.No", "Name", "Phone Number"]],
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: "bold",
      },
      body: guarantorFor.map((g, i) => [i + 1, g.name || "-", g.phone || "-"]),
      styles: { halign: "left" },
    });
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("No records found.", 20, 55);
  }

  // ==========================
  // SECTION 2: Has Guarantors
  // ==========================
  const nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 70;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 118, 210);
  doc.text("Has Guarantors:", 15, nextY);

  if (Array.isArray(hasGuarantors) && hasGuarantors.length > 0) {
    autoTable(doc, {
      startY: nextY + 5,
      head: [["S.No", "Name", "Phone Number"]],
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: "bold",
      },
      body: hasGuarantors.map((g, i) => [i + 1, g.name || "-", g.phone || "-"]),
      styles: { halign: "left" },
    });
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("No records found.", 20, nextY + 5);
  }

  // 🧾 Preview + Download
  const pdfBlob = doc.output("bloburl");
  window.open(pdfBlob, "_blank");
  doc.save(`${member.name || "Member"}_Guarantor_Report.pdf`);
};
