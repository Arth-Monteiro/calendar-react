import { Box, Button, Container, TextField } from "@mui/material";
import { FormEvent, useRef, useState } from "react";
import IUser from "../interfaces/IUser";
import { apiMakeLogin } from "../services/apiService";

interface ILoginPageProp {
  onSignIn: (user: IUser) => void;
}

export default function LoginPage({ onSignIn }: ILoginPageProp) {
  const [email, setEmail] = useState<string>("arthur@email.com");
  const [pwd, setPwd] = useState<string>("1234");
  const [error, setError] = useState<string>("");

  function onCancel() {
    setEmail("");
    setPwd("");
  }

  async function onSubmit(evt: FormEvent) {
    evt.preventDefault();
    const login = await apiMakeLogin(email, pwd);
    if (!login) {
      setError("Sorry, email or password not founds...");
    } else {
      onSignIn(login);
    }
  }

  const inputEmail = useRef<HTMLInputElement | null>();
  const inputPwd = useRef<HTMLInputElement | null>();

  return (
    <Container maxWidth="sm">
      <h1>Calendar React</h1>
      <p>Insert email and password to access.</p>
      <p>
        To try, use email <kbd>arthur@email.com</kbd> and password <kbd>1234</kbd>.
      </p>
      <form onSubmit={onSubmit}>
        <TextField
          inputRef={inputEmail}
          id={"emailLogin"}
          label="Email"
          margin="normal"
          variant="outlined"
          value={email}
          fullWidth
          autoFocus
          onChange={(evt) => setEmail(evt.target.value)}
          error={!!error}
        />
        <TextField
          inputRef={inputPwd}
          id={"passwordLogin"}
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={pwd}
          fullWidth
          onChange={(evt) => setPwd(evt.target.value)}
          error={!!error}
        />

        {error && (
          <Box
            sx={{
              backgroundColor: "rgb(253, 236,234)",
              borderRadius: "4px",
              padding: "16px",
              margin: "16px 0",
            }}
          >
            {error}
          </Box>
        )}

        <Box textAlign={"right"} marginTop="16px">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </form>
    </Container>
  );
}
