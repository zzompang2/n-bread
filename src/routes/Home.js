import React from 'react';
import "./Home.css";
import bg from "../images/bread.jpg";

function Home() {
	return (
		<div className="container">
			<img className="bgImage" src={bg} alt="빵" />
			<p>여러 명이 결제했더라도<br/>한 번의 송금으로 정산을 완료하세요.</p>
			<div className="people">
				<span>N =</span>
				<input
					type="number"
					title="인원수"
					// disabled={false}
					placeholder="0" />
			</div>
			<button className="calBtn">계산하기</button>
		</div>
	)
}

export default Home;