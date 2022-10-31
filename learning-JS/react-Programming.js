"다가올 리액트의 변화:파이버. fiber"

// 파이버 이전에는 렌더링을 한번 시작하면 중간에 멈출 수 없었다.
// 따라서 컴포넌트의 개수가 상당히 많은 경우에 렌더링을 시작하면 사용자의 마우스나 키보드 이벤트에 거의 반응할 수 없었다.
// 리액트는 이렇게 처리해야 할 일이 많은 상황에서도 사용자의 요청에 반응할 방법을 운영체제의 선점형 멀티 태스킹 개념에서 찾았다.

// 파이버에서는 렌더링 과정을 여러 개의 작업으로 나눠서 실행 중인 작업을 중단하거나 중단된 작업을 재개할 수 있다.

// 하나의 프로그램이 CPU를 점유하지 못하도록 하기 위해 일정 시간이 지나면 실행 중인 프로그램을 멈추고 다른 프로그램을 실행. 이를 멀티태스킹이라고 부른다.
// 멀티태스킹을 하기 위해서는 실행중인 프로그램의 현재 상태를 저장하고, 나중에 다시 실행 될 때 이전 상태를 복원할 방법이 필요하다.

// 작업이 일정 시간을 초과하거나, 현재 실행 중인 작업보다 우선순위가 더 높은 작업이 들어오면 현재 작업을 중단. 
// 따라서 파이버에서는 우선순위가 낮은 작업의 양이 많다고 하더라도 사용자의 키보드 입력에 빠르게 반응

"작업의 우선순위를 통한 효율적인 CPU 사용"

// 첫 번째 방식. 컴포넌트의 상태값을 변경할 때, 사용자가 직접 우선순위를 입력하는 것이다.
// 두 번째 방식. 이벤트 처리 함수별로 리액트가 자동으로 우선순위를 결정하는 것이다.

// App.js
  function App () { // hidden 속성값으로 우선순위 낮게 설정하기
  	const [currentTab, setCurrentTab] = useState(1);
  	
  	return (
  	  `<div>
  	    <button onClick={() => setCurrentTab(1)}>tab1</button>
  	    <button onClick={() => setCurrentTab(2)}>tab2</button>
  	    <div hidden={currentTab !== 1}>
  	      <p>this is tab 1</p>
  	    </div>
  	    <div hidden={currentTab !== 2}>
  	      <p>this is tab 2</p>
  	    </div>
  	  </div>`
  	)
  }

"서스페스로 가능해진 렌더 함수 내 비동기 처리"

// index.js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import App from './App'
  
  ReactDOM.render(`<App>`, document.getElementById('root))
