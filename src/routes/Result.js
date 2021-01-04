import React from 'react';
import "./Result.css";

class Result extends React.Component {
	render() {
		const { location: { state }, history } = this.props;
		const { number, people, payments } = state;
		const totalPaidMoney = [];

		for (let i=0; i<number; i++)
			totalPaidMoney.push(0);
		
		for (let i=0; i<payments.length; i++) {
			const { payer, joins } = payments[i];
			let money = Number(payments[i].money);
			let joinNum = 0;

			for (let j=0; j<joins.length; j++)
				if (joins[j])
					joinNum += 1;

			// 나누어 떨어지지 않으면 payer 에게 올림해서 보내기로 한다
			const rest = money % joinNum;
			if (rest !== 0)
				money += (joinNum - rest);

			// payer 는 사용한 금액만큼 제외
			totalPaidMoney[payer] -= money;

			// 참가자들끼리 나누어 지불한다
			for (let j=0; j<joins.length; j++) {
				if (joins[j])
					totalPaidMoney[j] += money / joinNum;
			}
		}

		console.log(totalPaidMoney);

		return (
			<div>
				<div className="payment">
					<span className="payment__id">id</span>
					<span className="tag payment__name">name</span>
					<span className="tag payment__name">결제액</span>
				</div>
				{people.map(person => (
					<div key={person.id} className="payment">
						<div className="payment__id">{person.id}</div>
						<div className="payment__name">{person.name}</div>
						<div className="payment__name">{totalPaidMoney[person.id]}</div>
					</div>
				))}
			</div>
		);
	}
}

export default Result;