import React from 'react';
import { Link } from 'react-router-dom';
import "./Calculation.css";
import logo from "../images/logo_before.png";

const errorMsgs = [
	"",
	"사람이 아무도 없어요..",
	"혼자서 정산을..?",
	"양의 정수로 입력해 주세요.",
	"죄송해요, 20명까지만 지원해요.",
	"몇 명인지 먼저 입력하고 [확인]을 눌러주세요."
];

class Calculation extends React.Component {
	state = {
		numberInput: '',
		number: 0,
		people: [],
		payments: [],
		errorIdx: 0,
	}

	handleChangeNumber = (e) => {
		const { value } = e.target;
		this.setState({numberInput: value});
	}

	handleClickSetNumber = () => {
		const numberInput = Number(this.state.numberInput);

		if (numberInput === 0)
			this.setState({errorIdx: 1});
		else if (numberInput === 1)
			this.setState({errorIdx: 2});
		else if (numberInput < 0 || !Number.isInteger(numberInput))
			this.setState({errorIdx: 3});
		else if (numberInput > 20)
			this.setState({errorIdx: 4});
		else {
			const number = numberInput;
			const people = [];
			const payments = [];
			const joins = [];

			for (let i = 0; i < number; i++)
				joins.push(true);

			// const names = [...tempNames];
			// for (let i = 0; i < number; i++) {
			// 	const random = Math.floor(Math.random() * names.length);
			// 	console.log("random:", random, "namesLen:", names.length);
			// 	people.push({ id: i, name: names.splice(random, 1)});
			// }

			for (let i = 0; i < number; i++)
				people.push({ id: i, name: ""});

			payments.push({ pid: 0, payer: 0, money: "", joins: [...joins] });
			this.setState({number, people, payments, errorIdx: 0});
		}
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
		const { id: payId, value: newPayer } = e.target;
		const payments = [...this.state.payments];

		for (let i=0; i<payments.length; i++) {
			if (payments[i].pid === Number(payId)) {
				payments[i].payer = Number(newPayer);
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

		for (let i=0; i<payments.length; i++) {
			if (payments[i].pid === Number(value)) {
				const joins = [...payments[i].joins];
				joins[id] = checked;
				if (checked || this.atLeastOneIsTrue(joins)) {
					payments[i].joins = joins;
					this.setState({payments});
				}
				return;
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
		console.log("delete pid:"+pid);

		/* 하나 남은 원소는 없앨 수 없다 */
		if (payments.length === 1)
			return;

		for (let i=0; i < payments.length; i++) {
			if (payments[i].pid === Number(pid))
			{
				payments.splice(i, 1);
				this.setState({payments});
				break;
			}
		}
	}

	atLeastOneIsTrue(joins) {
		let atLeastOne = false;
		for (let i=0; i<joins.length; i++) {
			if (joins[i]) {
				atLeastOne = true;
				break;
			}
		}
		return atLeastOne;
	}

	componentDidMount() {
		const { location: { state } } = this.props;

		if (state !== undefined) {
			const { number, people, payments } = state;
			this.setState({numberInput: number, number, people, payments});
		}
	}

	render() {
		console.log("render");
		const { numberInput, number, people, payments, errorIdx } = this.state;
		const {
			handleChangeNumber,
			handleClickSetNumber,
			handleChangeName,
			handleChangeMoney,
			handleSelect,
			handleFocus,
			handleBlur,
			handleCheck,
			handleAdd,
			handleDelete } = this;

		return (
			<div className="container">
				<Link
					to={{ pathname: "/" }}>
					<img className="logoImage_small" src={logo} alt="빵" />
				</Link>
				
				<div className="title">정보 입력</div>

				{ number < 2 ?
				<div>
					<div className="bodyText">몇 명인가요?</div>
					<div className="numberBox">
						<input
							type="number"
							placeholder="0"
							autoComplete="off"
							value={numberInput}
							onChange={handleChangeNumber} />
						<button
							onClick={handleClickSetNumber}>확인</button>
					</div>
				</div>
				:
				<div className="bodyText">모두 {number}명이군요!</div>
				}
				<div className="errorMsg">{errorMsgs[errorIdx]}</div>

				{/* people list */}
				{ number >= 2 ?
				<div className="people">
					{/* table tag */}
					<div className="table__row">
						{/* <div className="bodyText table__id">번호</div> */}
						<div className="bodyText table__name">이름</div>
					</div>
					{/* table elements */}
					{people.map(person => (
						<div
							key={person.id}
							className="table__row">
							{/* <div
								className="table__id whiteBox">
									{person.id+1}
							</div> */}
							<div
								className="table__name whiteBox">
								<input
									id={person.id}
									placeholder={`사람${person.id+1}`}
									autoComplete="off"
									value={person.name}
									onChange={handleChangeName} />
							</div>
						</div>
					))}
				</div>
				: 
				<div /> 
				}

				{/* payment list */}
				{ number >= 2 ?
				<div className="payments">
					{/* table tag */}
					<div className="table__row">
						<div className="bodyText table__name">결제자</div>
						<div className="bodyText table__pay">금액</div>
						{people.map(person => (
							<div
								key={person.id}
								className="bodyText table__checkbox table__checkboxTag">
								{person.name === "" ?
								`사람${person.id+1}`
								: (
									person.name.length > 4 ? 
									person.name.slice(0, 4) + '..'
									:
									person.name
								)}</div>
						))}
						<div className="bodyText table__delButton" />
					</div>
					{/* table elements */}
					{payments.map(payment => (
						<div
							key={payment.pid}
							className="table__row">
							<div
								className="table__name whiteBox">
								<select
									id={payment.pid}
									value={payment.payer}
									onChange={handleSelect}>
									{people.map(person => (
										<option
											key={person.id}
											value={person.id}>
											{person.name === "" ? `사람${person.id+1}` : person.name}
										</option>
									))}
								</select>
							</div>
							<div
								className="table__pay whiteBox">
								<input
									id={payment.pid}
									type="number"
									placeholder={0}
									value={payment.money}
									autoComplete="off"
									onChange={handleChangeMoney}
									onFocus={handleFocus}
									onBlur={handleBlur} />
								<div>원</div>
							</div>
							{payment.joins.map((join, id) => (
								<div
									key={id}
									className="table__checkbox whiteBox">
									<input
										id={id}
										value={payment.pid}
										type="checkbox"
										checked={join}
										onChange={handleCheck} />
								</div>
							))}
							<div
								className="table__delButton">
								<button
									id={payment.pid}
									onClick={handleDelete}>X</button>
							</div>
						</div>
					))}
				</div>
				: <div /> }

				{ number >= 2 ?
				<button
						className="addButton"
						onClick={handleAdd}>+</button>
				: <div /> }

				<div className="navButton">
					{ number !== 0 ?
					<Link
						className="navButton__link"
						to={{
							pathname: "/result",
							state: {
								number,
								people,
								payments
							}
						}}>
						정산하기 ▶
					</Link>
					:
					<button
						className="navButton__link"
						onClick={() => this.setState({errorIdx: 5})}>
						정산하기 ▶
					</button>
					}
				</div>
			</div>
		);
	}
}

export default Calculation;