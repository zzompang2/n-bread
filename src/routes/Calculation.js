import React from 'react';
import { Link } from 'react-router-dom';
import "./Calculation.css";

class Calculation extends React.Component {
	state = {
		number: 0,
		people: [],
		payments: [],
		isValid: true
	}
	handleChangeName = (e) => {
		const people = [...this.state.people];
		const { id, value } = e.target;
		people[id].name = value;
		this.setState({people});
	}

	handleChangeMoney = (e) => {
		const { id, value } = e.target;
		const payments = [...this.state.payments];
		
		for (let i=0; i<payments.length; i++) {
			if (payments[i].pid === Number(id)) {
				payments[i].money = value;
				this.setState({payments});
				break;
			}
		}
	}

	handleSelect = (e) => {
		const { id, value } = e.target;
		console.log(id, value);
		const payments = [...this.state.payments];

		for (let i=0; i<payments.length; i++) {
			if (payments[i].pid === Number(id)) {
				payments[i].payer = value;
				this.setState({payments});
				break;
			}
		}
	}

	handleFocus = () => {
		console.log("focus!!");
	}

	handleBlur = () => {
		console.log("Blur!!");
	}

	handleCheck = (e) => {
		const { id, value, checked } = e.target;
		const payments = [...this.state.payments];
		console.log("id:"+id, "pid:"+value, checked);

		for (let i=0; i<payments.length; i++) {
			if (payments[i].pid === Number(value)) {
				payments[i].joins[id] = checked;
				this.setState({payments, isValid: this.verifyValue(i)});
				break;
			}
		}
	}

	handleAdd = () => {
		const { number, payments } = this.state;
		const newPid = payments[payments.length-1].pid + 1;
		const joins = [];
		for (let i = 0; i < number; i++)
			joins.push(true);

		payments.push({ pid: newPid, payer: 0, money: "", joins: [...joins] });
		this.setState({ payments });
	}

	handleDelete = (e) => {
		const payments = [...this.state.payments];
		const pid = e.target.id;
		console.log(pid);
		for (let i=0; i < payments.length; i++) {
			if (payments[i].pid === Number(pid))
			{
				payments.splice(i, 1);
				this.setState({payments});
				break;
			}
		}
	}

	verifyValue(pid) {
		const { payments } = this.state;

		let atLeastOne = false;
		for (let i=0; i<payments[pid].joins.length; i++) {
			if (payments[pid].joins[i]) {
				atLeastOne = true;
				break;
			}
		}
		return atLeastOne;
	}

	componentDidMount() {
		const { location: { state }, history } = this.props;
		console.log(history);
		if (state === undefined) {
			history.push("/");
		}
		else if (state.from === "/"){
			const { number } = state;
			const people = [];
			const payments = [];
			const joins = [];

			for (let i = 0; i < number; i++)
				joins.push(true);

			for (let i = 0; i < number; i++) {
				people.push({ id: i, name: "unknown"});
			}
			payments.push({ pid: 0, payer: 0, money: "", joins: [...joins] });
			this.setState({number, people, payments});
		}
		else if (state.from === "/calculation/result") {
			const { number, people, payments } = state;
			this.setState({number, people, payments});
		}
	}

	render() {
		console.log("render");
		const { number, people, payments, isValid } = this.state;
		const { 
			handleChangeName,
			handleChangeMoney,
			handleSelect,
			handleFocus,
			handleBlur,
			handleCheck,
			handleAdd,
			handleDelete } = this;
		return (
			<div>
				<div>총 인원 수: {number}</div>

				{/* people list */}
				<div className="payment">
					<span className="payment__id">id</span>
					<span className="tag payment__name">name</span>
				</div>
				{people.map(person => (
					<div key={person.id} className="payment">
						<div className="payment__id">{person.id}</div>
						<input
							id={person.id}
							className="payment__name"
							placeholder="이름"
							value={person.name}
							onChange={handleChangeName} />
					</div>
				))}

				{/* payment list */}
				<div className="payment">
					<span className="payment__id">pid</span>
					<span className="payment__id">payer</span>
					<span className="tag payment__name">name</span>
					<span className="tag payment__pay">pay</span>
					{people.map(person => (
						<span key={person.id} className="tag payment__name">{person.name}</span>
					))}
				</div>
				{payments.map(payment => (
					<div key={payment.pid} className="payment">
						<div className="payment__id">{payment.pid}</div>
						<div className="payment__id">{payment.payer}</div>
						<select
							id={payment.pid}
							className="payment__name"
							onChange={handleSelect}>
							{people.map(person => (
								<option key={person.id} value={person.id}>{person.name}</option>
							))}
						</select>
						<input
							id={payment.pid}
							className="payment__pay"
							type="number"
							placeholder={0}
							value={payment.money}
							onChange={handleChangeMoney}
							onFocus={handleFocus}
							onBlur={handleBlur} />
						{payment.joins.map((join, id) => (
							<input
								id={id}
								key={id}
								value={payment.pid}
								className="payment__name"
								type="checkbox"
								checked={join}
								onChange={handleCheck} />
						))}
						<button
							id={payment.pid}
							onClick={handleDelete}>X</button>
					</div>
				))}
				<button
					onClick={handleAdd}>추가</button>
				{isValid ?
					<Link
						className="completeBtn"
						to={{
							pathname: "/calculation/result",
							state: {
								number,
								people,
								payments
							}
						}}>
						완료
					</Link>
					:
					<div>항목당 최소 한 명은 참가해야 합니다.</div>}
			</div>
		);
	}
}

export default Calculation;