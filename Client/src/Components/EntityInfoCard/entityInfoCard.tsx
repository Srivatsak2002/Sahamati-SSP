import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { readEntitySecret, resetEntitySecret } from "../../Services/api";
import { toast } from "react-toastify";

interface InfoCardProps {
  icon: React.ReactElement<SvgIconComponent>;
  title: string;
  entityId: string;
  token: string;
}

const EntityInfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  entityId,
  token,
}) => {
  const [secret, setSecret] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleReadSecret = async () => {
    try {
      if (!secret) {
        const response = await readEntitySecret(entityId, token);
        setSecret(response.data.secret);
      } else {
        setSecret(null);
      }
    } catch (error) {
      toast.error("Error reading entity secret. Please try again.");
    }
  };

  const handleResetSecret = async () => {
    try {
      await resetEntitySecret(entityId, token);
      setSecret(null);
      toast.success("Entity secret reset successfully.");
    } catch (error) {
      toast.error("Error resetting entity secret. Please try again.");
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast.success("Secret copied to clipboard!");
    } else {
      toast.info("No secret to copy.");
    }
  };

  return (
    <>
      <Card
        sx={{
          padding: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "calc(45%)",
          minHeight: "150px",
          marginBottom: "16px",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <Stack
              direction="column"
              spacing={1}
              sx={{ marginTop: "-4px", marginRight: "8px" }}
            >
              <Box>{icon}</Box>
              <Typography variant="h5">{title}</Typography>
              <Typography>Entity Id : {entityId}</Typography>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              component="div"
              sx={{
                whiteSpace: "pre-line",
                fontSize: "14px",
                mr: "4rem",
              }}
            >
              {secret
                ? `Secret: ${secret}`
                : "Secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
            </Typography>
            <Tooltip
              title={
                secret
                  ? "Click here to hide the secret"
                  : "Click to read the secret"
              }
              arrow
            >
              <IconButton onClick={handleReadSecret}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {secret && (
              <Tooltip title="Copy secret to clipboard" arrow>
                <IconButton onClick={handleCopySecret}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Reset the entity secret" arrow>
              <IconButton onClick={handleOpenDialog}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {"Confirm Secret Reset"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to reset the entity secret for {entityId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetSecret} color="primary" autoFocus>
            Yes, Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntityInfoCard;
