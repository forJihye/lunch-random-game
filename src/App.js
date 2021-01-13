import './App.scss';
import React, { useRef, useState } from 'react';
import MENUS from './config';
import {createMenuData, shuffleArray} from './utils';

// const Item = React.forwardRef(({menu, onClick, ...props}, ref) => {
//   return <span ref={ref} onClick={onClick} className='menu-list__item' {...props}>{menu}</span>
// }) 
// setAllMenu(!allMenu);
// const menuItems = menuList.current.children;
// [...menuItems].forEach(menu => {
//   const className = 'menu-list__item--active';
//   const ishave = menu.classList.contains(className);
//   ishave ? menu.classList.remove(className) : menu.classList.add(className)
// });
const Menu = ({name, ...props}) => <span {...props} className="menu-list__item">{name}</span>

const SelectMenu = ({menu, onClick, ...props}) => {
  return <span 
    {...props} 
    className={`menu-list__item ${menu.select ? 'menu-list__item--active' : ''}`} 
    onClick={() => onClick(menu)}
  >{menu.name}</span>
}
const SelectedMenu = ({name, ...props}) => <span {...props} className="shuffle__item">{name}</span> 

const initalMenus = createMenuData(MENUS);

class Shuffle {
  y;
  render(el){
    el.style.transform = `translateY(${this.y}px)`
  }
}

function App() {
  const [menus, setMenus] = useState(initalMenus);
  const [newMenu, setNewMenu] = useState('');
  const [allSelected, setAllSelected] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const shuffleTarget = useRef();
  const selectedMenus = menus.filter(({select}) => select);

  return <>
    <main className='main'>
      <h2 className='main__title'>오늘 뭐묵?</h2>
      <p className='main__desc'>귀한 점심시간을 1분1초도 허투루 흘러가지 않도록 (먹기 싫어도 먹어야함)</p>
      <section className='section'>
        {!selectedMenus.length ? <button className='handler neumo-active' onClick={_=> setIsPopup(!isPopup)}>
          <svg className='icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>메뉴 선택</span>
        </button> : null}

        {selectedMenus.length ? <div className="section__menu">
          <h4>선택한 메뉴</h4>
          <div className="menu-list">
            {menus.map((menu, id) => menu.select ? <Menu key={`menu${id}`} name={menu.name} /> : null)}
          </div>
        </div> : <div className="menu-none">후보 메뉴를 먼저 선택하세요!</div>}
      </section>
      
      {selectedMenus.length 
      ? <> 
        <section className="section section__shuffle">
          <div className="shuffle__wrap">
            <div className="shuffle__inner" ref={shuffleTarget}>
              {shuffleArray(selectedMenus).map((menu, i) => {
                return menu.select ? <SelectedMenu key={`menu${i}`} name={menu.name} /> : null;
              })}
            </div>
          </div>
        </section> 
        <button 
          className='handler neumo' 
          style={{marginTop: 20, borderRadius: 15}}
          onClick={() => {
            const spin = () => {
              const shuffle = new Shuffle();
              const length = selectedMenus.length * 26;
              shuffle.y += 26;
              shuffle.render(shuffleTarget.current);
              requestAnimationFrame(spin);
            }
            // shuffleTarget.current.style.transform = 'translateY(-26px)'
          }}
        >
          <svg className='icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span>start!</span>
        </button>
      </>
      : null}
    </main>

    <section className={`popup ${isPopup ? 'block' : 'hidden'}`}>
      <div className="popup__wrap">
        <h1 className="popup__title">메뉴 후보 선택</h1>
        <div className="popup__inner">
          <div className="popup__inner-handler">
            <div className="menu-all">
              <button 
                className="menu-all__button neumo"
                onClick={() => {
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
                }}
              >{allSelected ? '전체 해제' : '전체 선택'}</button>
            </div>
            <div className="menu-add">
              <input 
                className="menu-add__input" 
                name="name" 
                value={newMenu} 
                onChange={({target}) => setNewMenu(target.value)} 
                placeholder="메뉴 추가"
              />
              <button
                className="menu-add__button"
                onClick={() => {
                  if(newMenu.length === 0) return;
                  const includes = menus.filter(menu => menu.name.includes(newMenu));
                  if(includes.length) return alert('이미 존재하는 메뉴입니다.');
                  setMenus(menus => {
                    const last = menus[menus.length-1];
                    return menus.concat({id: last.id+1, name: newMenu, select: true});
                  });
                }}
              >
                <svg className='icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        
          <div className='menu-list'>
            {menus.map((menu, i) => <SelectMenu 
              key={`menu${i}`} 
              menu={menu}
              onClick={({id, select}) => {
                setMenus(menus => menus.map(menu => {
                  if(menu.id === id) menu.select = !select;
                  return menu;
                }))
              }} 
            />)}
          </div>

          <button 
            className='menu-add__insert neumo'
            onClick={() => {
              if(selectedMenus.length < 3) return alert('메뉴을 3개 이상 선택하세요.');
              setIsPopup(!isPopup);
            }}
          >
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
