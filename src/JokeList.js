import React from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

class JokeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { jokes: [] };
	}

	/* get jokes if there are no jokes */

	componentDidMount() {
		const getJokes = async () => {
			let j = [ ...this.state.jokes ];
			let seenJokes = new Set();
			try {
				while (j.length < this.props.numJokesToGet) {
					let res = await axios.get('https://icanhazdadjoke.com', {
						headers : { Accept: 'application/json' }
					});
					let { status, ...jokeObj } = res.data;

					if (!seenJokes.has(jokeObj.id)) {
						seenJokes.add(jokeObj.id);
						j.push({ ...jokeObj, votes: 0 });
					} else {
						console.error('duplicate found!');
					}
				}
				this.setState({ jokes: j });
			} catch (e) {
				console.log(e);
			}
		};

		if (this.state.jokes.length === 0) getJokes();
	}

	componentDidUpdate() {
		const getJokes = async () => {
			let j = [ ...this.state.jokes ];
			let seenJokes = new Set();
			try {
				while (j.length < this.props.numJokesToGet) {
					let res = await axios.get('https://icanhazdadjoke.com', {
						headers : { Accept: 'application/json' }
					});
					let { status, ...jokeObj } = res.data;

					if (!seenJokes.has(jokeObj.id)) {
						seenJokes.add(jokeObj.id);
						j.push({ ...jokeObj, votes: 0 });
					} else {
						console.error('duplicate found!');
					}
				}
				this.setState({ jokes: j });
			} catch (e) {
				console.log(e);
			}
		};

		if (this.state.jokes.length === 0) getJokes();
	}

	/* empty joke list and then call getJokes */

	generateNewJokes = () => this.setState({ jokes: [] });

	/* change vote for this id by delta (+1 or -1) */

	vote = (id, delta) => {
		const allJokes = this.state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j));
		this.setState({ jokes: allJokes });
	};

	/* render: either loading spinner or list of sorted jokes. */

	render() {
		if (this.state.jokes.length) {
			let sortedJokes = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);

			return (
				<div className="JokeList">
					<button className="JokeList-getmore" onClick={this.generateNewJokes}>
						Get New Jokes
					</button>

					{sortedJokes.map((j) => (
						<Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
					))}
				</div>
			);
		}

		return <Loader type="TailSpin" color="#ff6347" height={100} width={100} timeout={3000} className="loading" />;
	}
}

JokeList.defaultProps = { numJokesToGet: 10 };

export default JokeList;
