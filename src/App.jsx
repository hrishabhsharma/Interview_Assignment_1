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
  const [completedTasks, setCompletedTasks] = useState([])
  const [isEditDialog, setIsEditDialog] = useState(false)
  const [isEditable, setIsEditable] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    axios('https://jsonplaceholder.typicode.com/users/1/todos')
      .then((response) => {
        setAllTasks(response.data)
        setCompletedTasks(response.data.filter((task) => task.completed))
      })
      .catch((err) => console.log(err))
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCompletedTask = () => {
    setIsCompleted(!isCompleted)

    if (window.innerWidth <= '1300') {
      handleDrawerToggle()
    }
  }

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
      setCompletedTasks(update)

      toggleEditDialogBox()
    }
  }

  const handleDelete = (todo) => {
    const update = (state) => state.filter((item) => item.id !== todo.id)

    setAllTasks(update)
    setCompletedTasks(update)
  }

  const handleCompleted = (todo) => {
    setAllTasks((state) => state.map((task) => {
      if (task.id === todo.id) {
        return { ...task, completed: !task.completed }
      }
      return task
    }))

    const match = completedTasks.find((task) => task.id === todo.id)

    if (match) {
      setCompletedTasks((state) => state.filter((task) => task.id !== todo.id))
    } else {
      todo.completed = !todo.completed
      setCompletedTasks((state) => [todo, ...state])
    }
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
        padding: '1em',
        minHeight: '4em',
        bgcolor: todo.completed ? 'lightsteelblue' : '',

      }}
    >
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
        <IconButton onClick={() => handleCompleted(todo)}>
          <TaskAltIcon />
        </IconButton>
      </ButtonGroup>
    </Paper>
  )

  const renderAllPage = (
    <Container
      maxWidth="md"
      sx={{ marginTop: '7em' }}
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
      <Stack spacing={2} mt={3} width='90%' marginX='auto'>
        {allTasks && allTasks.map(renderTodo)}
      </Stack>
    </Container>
  )

  const renderCompletedTask = (
    <Container
      maxWidth="md"
      sx={{ marginTop: '7em' }}
    >
      <Stack spacing={2} mt={3} width='90%' marginX='auto'>
        {completedTasks && completedTasks.map(renderTodo)}
      </Stack>
    </Container>
  )

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar color='inherit' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
        <Box mt={5} marginX={3}>
          <Stack spacing={1}>
            <Button onClick={toggleCompletedTask} size='large'>All tasks</Button>
            <Button onClick={toggleCompletedTask} size='large'>Completed Tasks</Button>
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
