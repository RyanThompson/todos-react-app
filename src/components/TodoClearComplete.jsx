import React from 'react';
import PropTypes from 'prop-types';

TodoClearComplete.propTypes = {
	clearComplete: PropTypes.func.isRequired,
};

function TodoClearComplete(props) {
	return (
		<button onClick={props.clearComplete} className="button">
			Clear completed
		</button>
	);
}

export default TodoClearComplete;
