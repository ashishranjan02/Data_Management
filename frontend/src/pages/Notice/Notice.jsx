import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Chip,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  Announcement as NoticeIcon,
  CloudUpload as UploadIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import SectionHeader from "../../layout/SectionHeader";

const NoticePage = () => {
  const [snackOpen, setSnackOpen] = useState(false);

  // 🔹 Dummy Member List (✅ Added mobile & email)
  const members = [
    { id: "M001", name: "John Doe", mobile: "9876543210", email: "john@example.com" },
    { id: "M002", name: "Jane Smith", mobile: "8765432109", email: "jane@example.com" },
    { id: "M003", name: "Michael Johnson", mobile: "7654321098", email: "michael@example.com" },
    { id: "M004", name: "Sarah Williams", mobile: "6543210987", email: "sarah@example.com" },
    { id: "M005", name: "David Brown", mobile: "5432109876", email: "david@example.com" },
  ];

  const formik = useFormik({
    initialValues: {
      selectedMembers: [],
      note: "",
      files: [],
    },
    onSubmit: (values) => handleShare(values),
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("files", Array.from(e.target.files));
  };

  const handleShare = async (values) => {
    const { selectedMembers, note } = values;
    const memberNames =
      selectedMembers.length > 0
        ? selectedMembers.map((m) => m.name).join(", ")
        : "No members selected";
    const text = `NOTICE\n\nTo: ${memberNames}\n\n${note || "No additional notes."}`;

    const sharePayload = { title: "Notice", text };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch {
        console.log("Share cancelled or failed");
      }
    } else {
      await navigator.clipboard.writeText(text);
      setSnackOpen(true);
    }
  };

  const getUrls = (values) => {
    const { selectedMembers, note } = values;
    const memberNames =
      selectedMembers.length > 0
        ? selectedMembers.map((m) => m.name).join(", ")
        : "No members selected";
    const text = `NOTICE\n\nTo: ${memberNames}\n\n${note || "No additional notes."}`;

    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`,
      email: `mailto:?subject=Notice&body=${encodeURIComponent(text)}`,
    };
  };

  const urls = getUrls(formik.values);

  const availableMembers = members.filter(
    (m) => !formik.values.selectedMembers.some((s) => s.id === m.id)
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        mt: 4,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <SectionHeader
          icon={<NoticeIcon color="primary" />}
          title="Notice Management"
          subtitle="Send important notices to members"
        />

        <form onSubmit={formik.handleSubmit}>
          <Box mt={3}>
            <Autocomplete
              options={availableMembers}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              onChange={(event, newValue) => {
                if (newValue) {
                  formik.setFieldValue("selectedMembers", [
                    ...formik.values.selectedMembers,
                    newValue,
                  ]);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search and Select Member"
                  placeholder="Type to search..."
                />
              )}
              sx={{ width: "100%" }}
              clearOnBlur
            />
          </Box>

          {formik.values.selectedMembers.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Selected Members:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formik.values.selectedMembers.map((member) => (
                  <Chip
                    key={member.id}
                    label={`${member.name} (${member.id})`}
                    color="primary"
                    variant="outlined"
                    onDelete={() =>
                      formik.setFieldValue(
                        "selectedMembers",
                        formik.values.selectedMembers.filter(
                          (m) => m.id !== member.id
                        )
                      )
                    }
                  />
                ))}
              </Stack>

              {/*  Display Mobile & Email under Selected Members */}
              <Box mt={2}>
                {formik.values.selectedMembers.map((member) => (
                  <Card
                    key={member.id}
                    variant="outlined"
                    sx={{ p: 2, mt: 1, borderRadius: 2, background: "#f9f9f9" }}
                  >
                    <Typography variant="body1">
                      <strong>{member.name}</strong> ({member.id})
                    </Typography>
                    <Typography variant="body2">📞 {member.mobile}</Typography>
                    <Typography variant="body2">✉️ {member.email}</Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          <Box mt={3}>
            <TextField
              multiline
              rows={4}
              name="note"
              label="Additional Note"
              value={formik.values.note}
              onChange={formik.handleChange}
              fullWidth
            />
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Files
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload
              <input type="file" multiple hidden onChange={handleFileChange} />
            </Button>

            {formik.values.files.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {formik.values.files.map((f) => f.name).join(", ")}
              </Typography>
            )}
          </Box>

          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
          >
            <Tooltip title="Share Notice">
              <IconButton
                color="primary"
                type="submit"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  p: 2,
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              color="success"
              startIcon={<WhatsAppIcon />}
              href={urls.whatsapp}
              target="_blank"
            >
              WhatsApp
            </Button>
          </Box>
        </form>

        <Snackbar
          open={snackOpen}
          autoHideDuration={2000}
          onClose={() => setSnackOpen(false)}
          message="Copied to clipboard!"
        />
      </CardContent>
    </Card>
  );
};

export default NoticePage;
