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
					todos
				);
			});
        });
	};

	function addTodo(todo) {

        let newTodo = {
            id: new Date().getTime(),
            title: todo,
            complete: false,
        };

        app.streams.repository('todos').then(repository => {
            newTodo = repository.create(newTodo);
        });
        
		setTodos([
			...todos,
			newTodo,
		]);
	}

	function deleteTodo(id) {

        let todo = [...todos].filter(todo => todo.id === id);

        app.streams.repository('todos').then(repository => {
            repository.delete(todo[0]);
        });
        
        setTodos([...todos].filter(todo => todo.id !== id));
	}

	function completeTodo(id) {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				todo.complete = !todo.complete;

                todo.save();
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

				delete todo.editing;

                todo.save();
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
