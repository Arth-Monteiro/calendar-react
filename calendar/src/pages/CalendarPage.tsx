import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Icon,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const borderColor = "1px solid rgb(224, 224, 224)";

const useStyles = makeStyles({
  table: {
    borderTop: borderColor,
    minHeight: "100%",
    "& th ~ th, & td ~ td": {
      borderLeft: borderColor,
    },
  },
});

export default function CalendarPage() {
  const classes = useStyles();

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      {/* Begin Calendar Selects Panel */}
      <Box borderRight={borderColor} width="16em" padding="8px 16px">
        <h2>Calendar React</h2>
        <Button variant="contained" color="primary">
          New Event
        </Button>

        <Box marginTop="64px">
          <h3>Calendars</h3>
          <FormControlLabel control={<Checkbox />} label="Pessoal" />
          <FormControlLabel control={<Checkbox />} label="Trabalho" />
        </Box>
      </Box>
      {/* End Calendar Selects Panel */}

      <TableContainer component={"div"}>
        <Box display="flex" alignItems="center" padding="8px 16px">
          {/* Begin Choose Month */}
          <Box>
            <IconButton aria-label="Previus Month">
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton aria-label="Next Month">
              <Icon>chevron_right</Icon>
            </IconButton>
          </Box>
          {/* End Choose Month */}

          {/* Begin Name Month */}
          <Box flex="1" marginLeft="16px" component="h3">
            Junho de 2021
          </Box>
          {/* End Name Month */}

          {/* Begin Avatar Button */}
          <IconButton aria-label="User">
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
          {/* End Avatar Button */}
        </Box>

        {/* Begin Calendar Table */}
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {DAYS_OF_WEEK.map((day) => (
                <TableCell align="center" key={day}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {DAYS_OF_WEEK.map((day) => (
                <TableCell align="center" key={day}>
                  {"x"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {DAYS_OF_WEEK.map((day) => (
                <TableCell align="center" key={day}>
                  {"y"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        {/* End Calendar Table */}
      </TableContainer>
    </Box>
  );
}
