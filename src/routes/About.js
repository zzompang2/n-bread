import React from 'react';
import { Link } from 'react-router-dom';
import "./About.css";
import logo from "../images/logo_after.png";

function About() {
	return (
		<div className="container">
			<img className="logoImage" src={logo} alt="빵" />
			<div className="bodyText">
				제작자: 함창수<br/>
				웹: N빵 (N-bread)<br/><br/>
				여행갈 때, 같이 밥먹고 카페갈 때...<br/>
				한 사람이 결제했으면 편했겠지만 여러 명이 결제한 경우에는<br/>
				각자에게 송금을 해줘야 해서 참으로 귀찮았습니다.<br/><br/>
				계산을 잘 하면 모두가 송금 한번만 해도 된다는 걸 깨닫고<br/>
				이 웹을 만들게 되었습니다.<br/><br/>

				2021년 1월 6일
			</div>
			<div className="navButton">
				<Link
					className="navButton__link"
					to={{ pathname: "/" }}>
					홈으로
				</Link>
			</div>
		</div>
	)
}

export default About;