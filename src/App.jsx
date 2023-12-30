import { useEffect, useState } from 'react';

import { ThemeProvider } from '@emotion/react'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditNote as EditNoteIcon,
  Menu as MenuIcon,
  TaskAlt as TaskAltIcon,
} from '@mui/icons-material';

import axios from 'axios';

const defaultTheme = createTheme({
  palette: { mode: 'light' },
  typography: {
    fontFamily: ['Lato'].join(','),
  },
});

function App() {
  const [allTasks, setAllTasks] = useState([])
  const [isEditDialog, setIsEditDialog] = useState(false)
  const [isEditable, setIsEditable] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    axios('https://jsonplaceholder.typicode.com/users/1/todos')
      .then((response) => {
        setAllTasks(response.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const toggleCompletedTask = () => {
  //   setIsCompleted(!isCompleted)

  //   if (window.innerWidth <= '1300') {
  //     handleDrawerToggle()
  //   }
  // }

  const handleAddTask = (event) => {
    event.preventDefault();

    const newTask = {
      id: allTasks.length + 1,
      title: event.target.todo.value,
      completed: false
    }

    setAllTasks((state) => [newTask, ...state])

    event.target.reset();
  }

  const toggleEditDialogBox = () => {
    setIsEditDialog(!isEditDialog)
  }

  const onUpdateTask = (event) => {
    setIsEditable((state) => ({
      ...state,
      title: event.target.value
    }))
  }

  const handleEdit = (todo) => {
    if (!isEditDialog) {
      toggleEditDialogBox()
      setIsEditable(todo)
    } else {
      const update = (state) => state.map((task) => {
        if (task.id === isEditable.id) {
          return isEditable
        }
        return task
      })

      setAllTasks(update)

      toggleEditDialogBox()
    }
  }

  const handleDelete = (todo) => {
    const update = (state) => state.filter((item) => item.id !== todo.id)

    setAllTasks(update)
  }

  const handleCompleted = (todo) => {
    setAllTasks((state) => state.map((task) => {
      if (task.id === todo.id) {
        return { ...task, completed: !task.completed }
      }
      return task
    }))
  }

  const renderTodo = (todo) => (
    <Paper
      key={todo.id}
      variant='outlined'
      square={false}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        bgcolor: todo.completed ? 'lightsteelblue' : '',
      }}
    >
      <IconButton onClick={() => handleCompleted(todo)}>
        <TaskAltIcon />
      </IconButton>
      <Typography variant='h6'>
        {todo.title}
      </Typography>
      <ButtonGroup>
        <IconButton onClick={() => handleEdit(todo)}>
          <EditNoteIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(todo)}>
          <DeleteIcon />
        </IconButton>

      </ButtonGroup>
    </Paper>
  )

  const renderAllPage = (
    <Container
      maxWidth="md"
      sx={{ marginTop: '7em', padding: '1em 0' }}
    >
      <Box
        component='form'
        onSubmit={handleAddTask}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '2em',
          height: '3em'
        }}
      >
        <TextField
          id='todo'
          name='todo'
          placeholder='add your task'
          size='small'
          color='primary'
          autoFocus
          fullWidth
          required
          sx={{
            bgcolor: 'white'
          }}
        />
        <Button
          type='submit'
          variant='contained'
          sx={{
            whiteSpace: 'nowrap',
            minWidth: 'auto',
          }}
        >
          Add ToDo&apos;s
        </Button>
      </Box>
      <Divider sx={{ marginTop: '2em' }} />
      <Stack
        spacing={2}
        sx={{
          margin: '2em auto',
          width: '90%',
          maxHeight: '75vh',
          overflow: 'auto'
        }}
      >
        {allTasks && allTasks.map(renderTodo)}
      </Stack>
    </Container>
  )

  const renderCompletedTask = (
    <Container
      maxWidth="md"
      sx={{ marginTop: '7em', padding: '1em 0' }}
    >
      <Stack
        spacing={2}
        sx={{
          margin: '2em auto',
          width: '90%',
          maxHeight: '75vh',
          overflow: 'auto'
        }}
      >
        {allTasks && allTasks.filter((task) => task.completed).map(renderTodo)}
      </Stack>
    </Container>
  )

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar color='transparent' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xl: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h2' textAlign='center' width='100%'>
            To Do List
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        variant={!mobileOpen ? 'permanent' : 'temporary'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: !mobileOpen ? { xs: 'none', xl: 'block' } : { xs: 'block', xl: 'none' },
        }}
      >
        <Toolbar />
        <Box mt={5} marginX={1}>
          <Stack spacing={1}>
            <Button onClick={() => setIsCompleted(false)} size='large'>All tasks</Button>
            <Button onClick={() => setIsCompleted(true)} size='large'>Completed Tasks</Button>
          </Stack>
        </Box>
      </Drawer>
      {
        !isCompleted ? renderAllPage : renderCompletedTask
      }
      <Dialog
        open={isEditDialog}
        onClose={toggleEditDialogBox}
        fullWidth
        repositionOnUpdate={false}
        sx={{
          '.MuiPaper-root': {
            padding: 1,
          },
        }}
      >
        <DialogTitle>Edit the Todo Task</DialogTitle>
        <DialogContent>
          <TextField
            id='todo'
            placeholder='add your task'
            margin="dense"
            variant="standard"
            defaultValue={isEditDialog ? allTasks.find((t) => t.id === isEditable.id).title : ''}
            onChange={onUpdateTask}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleEditDialogBox}>Cancel</Button>
          <Button onClick={handleEdit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider >
  )
}

export default App
