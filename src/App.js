import './App.scss';
import React, { useRef, useState } from 'react';
import MENUS from './config';
import {createMenuData, shuffleArray} from './utils';

const MenuItem = ({name, ...props}) => <span {...props} className="menu-list__item">{name}</span>
const ShuffleItem = ({name, ...props}) => <span {...props} className="shuffle__item">{name}</span> 
const SelectMenuItem = ({menu, onClick}) => {
  return <span 
    className={`menu-list__item ${menu.select ? 'menu-list__item--active' : ''}`} 
    onClick={() => onClick(menu)}
  >{menu.name}</span>
}

const initalMenus = createMenuData(MENUS);

function App() {
  const [menus, setMenus] = useState(initalMenus);
  const [newMenu, setNewMenu] = useState('');
  const [result, setResult] = useState('');
  const [allSelected, setAllSelected] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const shuffleTarget = useRef();
  const selectedMenus = menus.filter(({select}) => select);

  const onAddNewMenu = () => {
    if(newMenu.length === 0) return;
    const includes = menus.filter(menu => menu.name.includes(newMenu));
    if(includes.length) return alert('이미 존재하는 메뉴입니다.');
    setMenus(menus => {
      const last = menus[menus.length-1];
      return menus.concat({id: last.id+1, name: newMenu, select: true});
    });
  }

  const onSelect = ({id, select}) => {
    setMenus(menus => menus.map(menu => {
      if(menu.id === id) menu.select = !select;
      return menu;
    }))
  }

  const onAllSelect = () => {
    let flag = allSelected;
    if(!flag){
      flag = true;
      setAllSelected(flag);
      setMenus(menus => menus.map(menu => ({...menu, select: flag})));
    }else{
      flag = false;
      setAllSelected(flag);
      setMenus(menus => menus.map(menu => ({...menu, select: flag})));
    }
  }

  const onSelected = () => {
    if(selectedMenus.length < 3) return alert('메뉴를 3개 이상 선택하세요.');
    setIsPopup(!isPopup);
  }

  const shuffle = ({start, end, duration, render, finished}) => {
    const now = performance.now();
    const items = shuffleArray([...shuffleTarget.current.childNodes]);
    requestAnimationFrame(function move(time){
      let timefraction = (time - now) / duration;
      const value = end * timefraction;
      const index = Math.floor(value % items.length);
      render(items, index);

      if(timefraction > 1) finished(items[index]);
      else requestAnimationFrame(move);
    });
  }
  const onShuffle = () => {
    shuffle({
      start: 0,
      end: 100, 
      duration: 3000, 
      render: (items, index) => {
        if(!items[index]) return;
        items.forEach(item => item.style.display = 'none');
        items[index].style.display = 'block';
      },
      finished: (result) => setResult(result.innerText)
    });
  }

  return <>
    <main className='main'>
      <h2 className='main__title'>오늘 뭐묵?</h2>
      <p className='main__desc'>귀한 점심시간을 1분1초도 허투루 흘러가지 않도록 (먹기 싫어도 먹어야함)</p>
      
      {selectedMenus.length 
      ? <>
        <section className='section'>
          <div className="section__menu">
            <h4>선택한 메뉴</h4>
            <div className="menu-list">
              {menus.map((menu, id) => menu.select ? <MenuItem key={`menu${id}`} name={menu.name} /> : null)}
            </div>
          </div> 
        </section>
        <h4 className="suffle__title">과연 오늘의 점심 메뉴는?</h4>
        <button className='handler neumo shuffle__start' onClick={onShuffle}>
          <span>{!result ? "메뉴 고르기 시작! 😜" : '마음에 안들어 😥 다시!'}</span>
        </button>
        <section className="section section__shuffle" ref={shuffleTarget}>
          {selectedMenus.map((menu, i) => {
            return menu.select ? <ShuffleItem key={`menu${i}`} name={menu.name} /> : null;
          })}
        </section> 
      </>
      : <section className='section'>
          <button className='handler neumo-active' onClick={_=> setIsPopup(!isPopup)}>
            <svg className='icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>메뉴 선택</span>
          </button> 
          <div className="menu-none">후보 메뉴를 먼저 선택하세요!</div>
      </section>}
    </main>

    <section className={`popup ${isPopup ? 'block' : 'hidden'}`}>
      <div className="popup__wrap">
        <h1 className="popup__title">메뉴 후보 선택</h1>
        <div className="popup__inner">
          <div className="popup__inner-handler">
            <div className="menu-all">
              <button className="menu-all__button neumo" onClick={onAllSelect}>
                {allSelected ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div className="menu-add">
              <input 
                className="menu-add__input" 
                name="name" 
                value={newMenu} 
                onChange={({target}) => setNewMenu(target.value)} 
                placeholder="메뉴 추가"
              />
              <button className="menu-add__button" onClick={onAddNewMenu}>
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        
          <div className='menu-list'>
            {menus.map((menu, i) => <SelectMenuItem key={`menu${i}`} menu={menu} onClick={onSelect} />)}
          </div>

          <button className='menu-add__insert neumo' onClick={onSelected}>
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>선택완료</span>
          </button>
        </div>
      </div>
    </section>
  </>
}

export default App;
