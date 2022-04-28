import { Box, Icon, IconButton } from "@mui/material";
import { dateToISOString, setMonth } from "../helpers/dateHelpers";
import IUser from "../interfaces/IUser";
import UserMenu from "./UserMenu";

interface ICalendarsViewProp {
  user: IUser;
  onSignOut: () => void;
  currentPeriod: Date;
}

export default function CalendarsHeader({ user, onSignOut, currentPeriod }: ICalendarsViewProp) {
  const previousPeriod = dateToISOString(setMonth(currentPeriod, false)).substring(0, 7);
  const nextPeriod = dateToISOString(setMonth(currentPeriod)).substring(0, 7);

  return (
    <Box display="flex" alignItems="center" padding="8px 16px">
      {/* Begin Choose Month */}
      <Box>
        <IconButton aria-label="Previus Month" href={`${previousPeriod}`}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton aria-label="Next Month" href={`${nextPeriod}`}>
          <Icon>chevron_right</Icon>
        </IconButton>
      </Box>
      {/* End Choose Month */}

      {/* Begin Name Month */}
      <Box flex="1" marginLeft="16px" component="h3">
        {currentPeriod.toLocaleString("default", { month: "long" })} {currentPeriod.getFullYear()}
      </Box>
      {/* End Name Month */}

      {/* Begin Avatar Button */}
      <UserMenu user={user} onSignOut={onSignOut} />
      {/* End Avatar Button */}
    </Box>
  );
}
