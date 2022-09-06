import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  paper: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
  },
  root: {
    '& .MuiTextField-root': {
      margin: 8,
    },
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: 16,
  },
  submit: {
    margin: '24px 0 16px'
    // margin: theme.spacing(3, 0, 2),
  },
  googleButton: {
    marginBottom: 16,
  },
}));
