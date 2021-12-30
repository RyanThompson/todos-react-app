import { useState, useEffect } from 'react';
import Empty from './Empty';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import '../reset.css';
import '../App.css';
import { Streams } from '@laravel-streams/api-client';

const streams = new Streams({
	baseURL: process.env.REACT_APP_API_URL
});

window.streams = streams;

function App() {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		getTodos();
	}, []);

	const getTodos = async () => {
		streams.entries('todos').then(query => {
			query
				.where('complete', false)
				.get()
				.then(todos => {
					setTodos(todos.all());
				});
		});
	};

	async function addTodo(todo) {
		
		let data = {
			title: todo,
			complete: false,
		};

		const repository = await streams.repository('todos');

		const newTodo = await repository.create(data);

		setTodos([...todos, newTodo]);
	}

	async function deleteTodo(id) {

		let todo = [...todos].find(todo => todo.id === id);
		
		const repository = await streams.repository('todos');

		await repository.delete(todo);
		
		setTodos([...todos].filter(todo => todo.id !== id));
	}

	function completeTodo(id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.complete = !todo.complete;

				todo.save();

				todo.editing = false;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function markAsEditing(id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.editing = true;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function updateTodo(event, id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				if (event.target.value.trim().length === 0) {
					todo.editing = false;
					return todo;
				}
				todo.title = event.target.value;

				todo.save();

				todo.editing = false;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function cancelEdit(event, id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.editing = false;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function remaining() {
		return todos.filter(todo => !todo.complete).length;
	}

	function clearComplete() {
		setTodos([...todos].filter(todo => !todo.complete));
	}

	function completeAllTodos() {
		const updatedTodos = todos.map(todo => {
			todo.complete = true;

			todo.save();

			return todo;
		});

		setTodos(updatedTodos);
	}

	function todosFiltered(filter) {
		if (filter === 'all') {
			return todos;
		} else if (filter === 'active') {
			return todos.filter(todo => !todo.complete);
		} else if (filter === 'complete') {
			return todos.filter(todo => todo.complete);
		}
	}

	return (
		<div className="todo-app-container">
			<div className="todo-app">
				<h2>Todo App</h2>
				<TodoForm addTodo={addTodo} />

				{todos.length > 0 ? (
					<TodoList
						todos={todos}
						completeTodo={completeTodo}
						markAsEditing={markAsEditing}
						updateTodo={updateTodo}
						cancelEdit={cancelEdit}
						deleteTodo={deleteTodo}
						remaining={remaining}
						clearComplete={clearComplete}
						completeAllTodos={completeAllTodos}
						todosFiltered={todosFiltered}
					/>
				) : (
					<Empty />
				)}
			</div>
		</div>
	);
}

export default App;
