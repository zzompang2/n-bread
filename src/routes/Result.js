import React from 'react';
import { Link } from 'react-router-dom';
import "./Result.css";
import logo from "../images/logo_after.png";

class Result extends React.Component {
	/* 합이 0 이 되는 subset 들로 최대한 나누고,
		 그 subset 들의 index array 를 반환한다. */
	getMaximumSubsets(paidMoney) {
		const money = [...paidMoney];
		const subsets = [[]];			/* 모든 subset 의 index array */
		const result = [];				/* 합이 0 이 되는 subset 의 index array */

		/* 모든 subset 의 index array 만들기.
		 * 현재까지의 부분집합 + 현재까지의 부분집합에 i 번째 원소를 넣은 부분집합 */
		for (let i=0; i<money.length; i++) {
			const len = subsets.length;
			for (let j=0; j<len; j++) {
				const subset = [...subsets[j], i];	/* new subset */
				let sum = 0;

				/* 길이가 전체의 절반 이상인데 합이 0 이려면,
				   이미 구한 RESULT 의 여집합인 경우 뿐이다 */
				if (subset.length > money.length/2)
					continue;

				/* SUBSET 의 총 금액 SUM 을 구한다
				   금액이 undefined 인 index 는 이미 RESULT 에 들어간 것이므로 제외 */
				for (let k=0; k<subset.length;) {
					if (money[subset[k]] !== undefined) {
						sum += money[subset[k]];
						k += 1;
					}
					else
						subset.splice(k, 1);
				}
				/* SUM 이 0 인 SUBSET 인 경우 RESULT 에 추가하고
					 다른 조합에 원소들이 포함되지 않도록 MONEY 값을 undefined 으로 한다.
					 그리고 I 번째 원소를 포함한 조합은 더이상 있을 수 없으므로 break. */
				if (sum === 0 && subset.length !== 0) {
					result.push(subset);
					for (let k=0; k<subset.length; k++)
						money[subset[k]] = undefined;
					break;
				}
				else
					subsets.push(subset);
			}
		}
		/* 남은 원소들이 있는 경우 (합은 0 이지만 길이가 전체 길이의 절반 초과인 경우) */
		const rest = [];
		for (let i=0; i<money.length; i++)
			if (money[i] !== undefined)
				rest.push(i);
		if (rest.length !== 0)
			result.push(rest);

		return result;
	}

	render() {
		const { location: { state } } = this.props;
		const { number, people, payments } = state;
		const { getMaximumSubsets, goBack } = this;

		const totalPaidMoney = [];		/* 각자 지불해야 할 총 금액 */

		for (let i=0; i<number; i++)
			totalPaidMoney.push(0);
		
		for (let i=0; i<payments.length; i++) {
			const { payer, joins } = payments[i];
			let money = Number(payments[i].money);
			let joinNum = 0;	/* 해당 지불 항목에 대한 총 참가자 수 */

			/* 총 참가자 수를 구한다 */
			for (let j=0; j<joins.length; j++)
				if (joins[j])
					joinNum += 1;

			/* 나누어 떨어지지 않으면 올림해서 보내기로 한다 */
			const rest = money % joinNum;
			if (rest !== 0)
				money += (joinNum - rest);

			/* PAYER 는 사용한 금액만큼 제외 */
			totalPaidMoney[payer] -= money;

			/* n 등분하여 각 참가자들의 지불 금액에 추가한다 */
			for (let j=0; j<joins.length; j++)
				if (joins[j])
					totalPaidMoney[j] += money / joinNum;
		}

		const subsets = getMaximumSubsets(totalPaidMoney);	/* index array of subset */
		const moneyFlows = [];															/* payer, payee 쌍의 집합 */

		/* 각 SUBSET 내에서 돈의 이동(from->to)를 구한다.
			 SUBSET 내의 money 총합은 0 이므로 SUBSET 내에서만 주고 받아 정산을 
			 끝낼 수 있다. n 명의 사람이 있다면 n-1 번의 송금으로 가능하다. 돈을 보내지
			 않는 한 사람(ROOT)은 총 지출액이 가장 큰 사람으로 정한다. */
		console.log(subsets);
		for (let i=0; i<subsets.length; i++) {
			const subset = subsets[i];
			const money = [];

			/* SUBSET 의 원소(전체 array 에서의 index)에 대응하는 money */
			for (let j=0; j<subset.length; j++)
				money.push(totalPaidMoney[subset[j]]);

			/* 총 지출액이 가장 큰 사람의 index */
			const root = money.indexOf(Math.min(...money));

			/* SUBSET 내에서 정산이 완료될 때까지 {FROM, TO} 를 구한다 */
			while (money[root] !== 0) {
				let from, to;

				for (let j=0; j<money.length; j++) {
					/* 돈을 줘야 하는 사람 */
					if (from === undefined && money[j] > 0) {
						from = j;
						/* ROOT 가 받을 금액보다 작은 경우, ROOT 에게 우선적으로 보낸다 */
						if (money[from] <= Math.abs(money[root]))
							to = root;
					}
					/* 돈을 보내야 하는 사람 */
					else if (to === undefined && money[j] < 0 && j !== root)
						to = j;

					if (from !== undefined && to !== undefined)
						break;
				}
				moneyFlows.push({from: subset[from], to: subset[to], money: money[from]});
				money[to] += money[from];
				money[from] = 0;
			}
		}
		
		let isAllZero = true;
		for (let i=0; i<moneyFlows.length; i++) {
			if (moneyFlows[i].money !== 0) {
				isAllZero = false;
				break;
			}
		}

		return (
			<div className="container">
				<Link
					to={{ pathname: "/" }}>
					<img className="logoImage_small" src={logo} alt="빵" />
				</Link>
				
				<div className="title">엔빵 완료!</div>
				<div className="payments">
					<div className="table__row">
						<span className="body__text table__id">번호</span>
						<span className="body__text table__name">이름</span>
						<span className="body__text table__pay">총 지불액</span>
					</div>
					{people.map(person => (
						<div key={person.id} className="table__row">
							<div className="table__id whiteBox">{person.id}</div>
							<div className="table__name whiteBox">{person.name}</div>
							<div className="table__pay whiteBox">{totalPaidMoney[person.id]}</div>
						</div>
					))}
				</div>

				<div className="empty" />

				{isAllZero ?
				<div className="body__text">정산할 게 없네요! 이렇게 깔끔할 수가!</div>
				:
				<div>
					<div className="body__text">돈 보내주세요</div>
					<div className="moneyFlow">
						<div className="table__row">
							<span className="body__text table__id">번호</span>
							<span className="body__text table__name">보내는 이</span>
							<span className="body__text table__pay">금액</span>
							<span className="body__text table__id">번호</span>
							<span className="body__text table__name">받는 이</span>
						</div>
					
						{moneyFlows.map((flow, idx) => (
							<div key={idx} className="table__row">
								<div className="table__id whiteBox">{flow.from}</div>
								<div className="table__name whiteBox">{people[flow.from].name}</div>
								<div className="table__pay whiteBox">{flow.money}원</div>
								<div className="table__id whiteBox">{flow.to}</div>
								<div className="table__name whiteBox">{people[flow.to].name}</div>
							</div>
						))}
					</div>
				</div>
				}
				<div className="empty" />
				
				<div className="navButton">
					<Link
						className="navButton__link"
						to={{
							pathname: "/calculation",
							state: {
								number,
								people,
								payments
							}
						}}>
						◀ 수정하기
					</Link>
				</div>
			</div>
		);
	}
}

export default Result;