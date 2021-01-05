import React from 'react';
import { Link } from 'react-router-dom';
import "./Calculation.css";

const errorMsgs = [
	"",
	"사람이 아무도 없어요..",
	"혼자서 정산을..?",
	"양의 정수로 입력해 주세요.",
	"죄송해요, 20명까지만 지원해요."
];
const tempNames = [
	"함창수",
	"최진",
	"정서현",
	"공희재",
	"조소정",
	"김상엽",
	"서승연",
	"양동해",
	"한다진",
	"김민주",
	"심건희",
	"김철환",
	"신정윤",
	"우혜인",
	"유승진",
	"이원준",
	"이정인",
	"전재형",
	"조재구",
	"최상아"
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
			// const { number } = state;
			const number = numberInput;
			const people = [];
			const payments = [];
			const joins = [];

			for (let i = 0; i < number; i++)
				joins.push(true);

			const names = [...tempNames];

			for (let i = 0; i < number; i++) {
				const random = Math.floor(Math.random() * names.length);
				console.log("random:", random, "namesLen:", names.length);
				people.push({ id: i, name: names.splice(random, 1)});
			}
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

				<div className="body__text">몇 명인가요?</div>
				<div className="numberBox">
					<input
						type="number"
						placeholder="0"
						value={numberInput}
						onChange={handleChangeNumber} />
					<button
						onClick={handleClickSetNumber}>확인</button>
				</div>
				<div className="errorMsg">{errorMsgs[errorIdx]}</div>

				{/* people list */}
				{ number >= 2 ?
				<div className="people">
					{/* table tag */}
					<div className="table__row">
						<div className="body__text table__id">번호</div>
						<div className="body__text table__name">이름</div>
					</div>
					{/* table elements */}
					{people.map(person => (
						<div
							key={person.id}
							className="table__row">
							<div
								className="table__id whiteBox">
									{person.id+1}
							</div>
							<div
								className="table__name whiteBox">
								<input
									id={person.id}
									placeholder="이름"
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
						<div className="body__text table__name">결제자</div>
						<div className="body__text table__pay">금액</div>
						{people.map(person => (
							<div
								key={person.id}
								className="body__text table__checkbox table__checkboxTag">
								{person.name.length > 4 ? 
								person.name.slice(0, 4) + '..'
								:
								person.name}</div>
						))}
						<div className="body__text table__delButton">삭제</div>
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
											{person.name}
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
									onChange={handleChangeMoney}
									onFocus={handleFocus}
									onBlur={handleBlur} />
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
						정산하기
					</Link>
					<Link
						className="navButton__link"
						to={{ pathname: "/" }}>
						돌아가기
					</Link>
				</div>
			</div>
		);
	}
}

export default Calculation;