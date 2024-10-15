import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface UserInfoProps {
  title: string;
  name: string;
  email: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ title, name, email }) => {
  return (
    <Card
      sx={{
        margin: "20px 0",
        padding: "15px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "1090px",
        ml: "280px",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: "10px" }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ margin: "5px 0" }}>
          <strong>Name:</strong> {name}
        </Typography>
        <Typography variant="body1" sx={{ margin: "5px 0" }}>
          <strong>Email:</strong> {email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
