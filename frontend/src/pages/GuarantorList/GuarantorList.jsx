import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { VerifiedUser as GuarantorIcon } from "@mui/icons-material";
import SectionHeader from "../../layout/SectionHeader";
import StyledTextField from "../../ui/StyledTextField";

const GuarantorList = () => {
  const [selectedMember, setSelectedMember] = useState("");

  //  Dummy Members
  const members = [
    { id: "M001", name: "John Doe" },
    { id: "M002", name: "Jane Smith" },
    { id: "M003", name: "Michael Johnson" },
    { id: "M004", name: "Sarah Williams" },
    { id: "M005", name: "David Brown" },
  ];

  //  Dummy “Guarantor For” Data (who this member guarantees)
  const guarantorFor = {
    M001: [
      { id: 1, name: "Jane Smith", phone: "9876543210" },
      { id: 2, name: "Sarah Williams", phone: "9123456780" },
    ],
    M002: [{ id: 1, name: "Michael Johnson", phone: "9998887776" }],
    M003: [],
    M004: [{ id: 1, name: "David Brown", phone: "9001122334" }],
    M005: [{ id: 1, name: "John Doe", phone: "8887776665" }],
  };

  //  Dummy “Has Guarantors” Data (who guarantees this member)
  const hasGuarantors = {
    M001: [{ id: 1, name: "Michael Johnson", phone: "8885554443" }],
    M002: [
      { id: 1, name: "John Doe", phone: "9876543210" },
      { id: 2, name: "Sarah Williams", phone: "9123456780" },
    ],
    M003: [{ id: 1, name: "Jane Smith", phone: "9998887776" }],
    M004: [],
    M005: [
      { id: 1, name: "Michael Johnson", phone: "9112233445" },
      { id: 2, name: "John Doe", phone: "9876543210" },
    ],
  };

  const selectedFor = guarantorFor[selectedMember] || [];
  const selectedHas = hasGuarantors[selectedMember] || [];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <SectionHeader
          icon={<GuarantorIcon color="primary" />}
          title="Guarantor Information"
          subtitle="Select a member to view guarantor relationships"
        />

        {/* 🔹 Member Selection */}
        <Grid container spacing={2} mt={2}>
          <Grid size={{xs:6, sm:6, md:3}}>
            <StyledTextField
              select
              fullWidth
              label="Select Member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <MenuItem value="">Select Member</MenuItem>
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
        </Grid>

        {/* 🔸 Display Tables Only When Member Selected */}
        {selectedMember && (
          <Box mt={4}>
            {/* Member is Guarantor For */}
            <Typography variant="h6" color="primary" gutterBottom>
              {members.find((m) => m.id === selectedMember)?.name} is Guarantor For:
            </Typography>
            {selectedFor.length > 0 ? (
              <Table size="small" sx={{ mb: 4 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedFor.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary" mb={3}>
                No records found.
              </Typography>
            )}

            {/* Member Has These Guarantors */}
            <Typography variant="h6" color="primary" gutterBottom>
              {members.find((m) => m.id === selectedMember)?.name} Has These Guarantors:
            </Typography>
            {selectedHas.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedHas.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No records found.
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GuarantorList;
