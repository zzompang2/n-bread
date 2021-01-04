import React from 'react';
import "./Home.css";
import bg from "../images/bread.jpg";
import { Link } from 'react-router-dom';

class Home extends React.Component {
	state = {
		input: 0
	}
	// const  poeple = document.querySelector("input").value;

	handleChange = (e) => {
    this.setState({
      input: e.target.value
    });
  }

	render() {
		const { input } = this.state;
    const {
			handleChange
		} = this;
		
		return (
			<div className="container">
				<img className="bgImage" src={bg} alt="빵" />
				<p>여러 명이 결제했더라도<br/>한 번의 송금으로 정산을 완료하세요.</p>
				<div className="people">
					<span>N =</span>
					<input
						placeholder="사람 수"
						type="number"
						title="인원수"
						onChange={handleChange} />
				</div>
				{input > 0 ?
					<Link
						className="calBtn"
						to={{
							pathname: "/calculation",
							state: { input }
						}}>
						N빵
					</Link>
					:
					<div className="calBtn">N빵</div>
				}
			</div>
		);
	}
}

export default Home;