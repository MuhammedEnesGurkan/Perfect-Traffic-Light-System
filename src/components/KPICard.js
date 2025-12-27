import { Card, CardContent, Typography } from "@mui/material";

export default function KPICard({ title, value }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="caption" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
