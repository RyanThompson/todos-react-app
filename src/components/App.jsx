import { useState, useEffect } from 'react';
import Empty from './Empty';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import '../reset.css';
import '../App.css';

const app = window.streams.core.app;

app.initialize({
	providers: [
		window.streams.core.HttpServiceProvider,
		window.streams.core.StreamsServiceProvider,
		//window.app.AppServiceProvider
	],
	config: {
		http: {
			//baseURL: this.env.get('APP_URL', 'http://localhost') + '/' + this.env.get('STREAMS_API_PREFIX', 'api'),
			baseURL: 'http://127.0.0.1:8000/api',
		},
	},
})
	.then(app => {
		app.boot.bind(app);

		console.log('Initialized');

		return app;
	})
	.then(app => {
		app.start();

		console.log('Started');

		return app;
	})
	.then(app => {
		// Not sure if this is the right place for this..
	});

function App() {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		getTodos();
	}, []);

	const getTodos = async () => {
		app.streams.entries('todos').then(query => {

            query.get().then(todos => {
				setTodos(
					todos.map(todo => {
						return {
							id: todo.id,
							title: todo.title,
							isComplete: todo.complete,
							isEditing: false,
						};
					})
				);
			});
        });

		//let entries = await = todos

		// setTodos(todos.map(todo => {
		//     return {
		//         id: todo.id,
		//         title: todo.title,
		//         isComplete: todo.complete,
		//         isEditing: false,
		//     }
		// }));
	};

	const [idForTodo, setIdForTodo] = useState(4);

	function addTodo(todo) {
		setTodos([
			...todos,
			{
				id: idForTodo,
				title: todo,
				isComplete: false,
			},
		]);

		setIdForTodo(prevIdForTodo => prevIdForTodo + 1);
	}

	function deleteTodo(id) {
		setTodos([...todos].filter(todo => todo.id !== id));
	}

	function completeTodo(id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.isComplete = !todo.isComplete;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function markAsEditing(id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.isEditing = true;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function updateTodo(event, id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				if (event.target.value.trim().length === 0) {
					todo.isEditing = false;
					return todo;
				}
				todo.title = event.target.value;
				todo.isEditing = false;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function cancelEdit(event, id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.isEditing = false;
			}

			return todo;
		});

		setTodos(updatedTodos);
	}

	function remaining() {
		return todos.filter(todo => !todo.isComplete).length;
	}

	function clearCompleted() {
		setTodos([...todos].filter(todo => !todo.isComplete));
	}

	function completeAllTodos() {
		const updatedTodos = todos.map(todo => {
			todo.isComplete = true;

			return todo;
		});

		setTodos(updatedTodos);
	}

	function todosFiltered(filter) {
		if (filter === 'all') {
			return todos;
		} else if (filter === 'active') {
			return todos.filter(todo => !todo.isComplete);
		} else if (filter === 'completed') {
			return todos.filter(todo => todo.isComplete);
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
						clearCompleted={clearCompleted}
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
