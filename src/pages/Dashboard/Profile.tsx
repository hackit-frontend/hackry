import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { auth } from "../../auth/firebase";

interface UserStats {
  completedTasks: number;
  rank: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const user = auth.currentUser;
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/users/${user.uid}/stats`)
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <Typography>{t("loadingUser")}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t("profile.title")}
      </Typography>

      <Card sx={{ maxWidth: 400, mb: 2 }}>
        <CardContent>
          <Typography variant="h6">{t("profile.userInfo")}</Typography>
          <Typography>
            {t("profile.name")}: {user.displayName}
          </Typography>
          <Typography>
            {t("profile.email")}: {user.email}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6">{t("profile.stats")}</Typography>
          {stats ? (
            <>
              <Typography>
                {t("profile.completedTasks")}: {stats.completedTasks}
              </Typography>
              <Typography>
                {t("profile.rank")}: {stats.rank}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              {t("profile.loadingStats")}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
