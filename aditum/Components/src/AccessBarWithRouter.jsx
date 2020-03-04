/**
 * @description Accessibility bar component to allow user to jump focus to different components on screen. 
 * One dropdown will focus to elements on screen.
 * The other will route you to routes in your navigation bar.
 * 
 * 
 * 
 * 
 */

import React, { useState, useEffect, useRef} from 'react';
import Dropdown from 'react-dropdown-aria';
import { useHistory} from 'react-router-dom';

const AccessBarWithRouter = () => {
  const pathname = useHistory().location.pathname;
  const [sectionInfo, setSectionInfo] = useState(null);
  const [navInfo, setNavInfo] = useState(null);
  const [isHidden, setIsHidden] = useState(true);

  // creating the refs to change focus
  const sectionRef = useRef(null);
  const accessBarRef = useRef(null);
  
  
  // sets focus on the current page from the 1st dropdown
  const setFocus = e => {
    const currentLabel = sectionInfo[e];
    const currentElement = document.querySelector(`[aria-labelledBy='${currentLabel}']`);
    currentElement.tabIndex = -1;
    sectionRef.current = currentElement;
    // can put a .click() after focus to focus with the enter button
    // works, but gives error
    sectionRef.current.focus();
  };


  // Changes the page when selecting a link from the 2nd dropdown
  const changeView = e => {
    const currentPath = navInfo[e];
    const accessLinks = document.querySelectorAll('.accessNavLink');
    accessLinks.forEach(el => {
      if (el.pathname === currentPath) {
        el.click();
      };
    });
  };

  // event handler to toggle visibility of AccessBar and set focus to it
  const accessBarHandlerKeyDown = e => {
    if (e.altKey && e.keyCode === 191) {
      if (isHidden) {
        setIsHidden(false)
        accessBarRef.current.focus();
      } else setIsHidden(true);
    }
  }


  /**
   *
   * useEffect hook to add and remove the event handler when 'alt' + '/' are pressed  
   * prior to this, multiple event handlers were being added on each button press 
   * */ 
  useEffect(() => {
    document.addEventListener('keydown', accessBarHandlerKeyDown);
    const navNodes = document.querySelectorAll('.accessNavLink');
    const navValues = {};
    navNodes.forEach(el => {
      navValues[el.text] = el.pathname;
    });
    setNavInfo(navValues);
    return () => document.removeEventListener('keydown', accessBarHandlerKeyDown);
  }, [isHidden]);


  /**
   * @todo figure out how to change the dropdown current value after click
   */
  useEffect(() => {
    //  selects all nodes with the aria attribute aria-labelledby
    setTimeout(() => {
      const ariaNodes = document.querySelectorAll('[aria-labelledby]');
      let sectionValues = {};
  
      ariaNodes.forEach(node => {
        sectionValues[node.getAttribute('aria-labelledby')] = node.getAttribute('aria-labelledby');
      });
  
      setSectionInfo(sectionValues);
    }, 500);
    
  }, [pathname]);
  


  // render hidden h1 based on isHidden
  if (isHidden) return <h1 id='hiddenH1' style={hiddenH1Styles}>To enter navigation assistant, press alt + /.</h1>;

  // function to create dropDownKeys and navKeys 
  const createDropDownValues = dropDownObj => {
    const dropdownKeys = Object.keys(dropDownObj);
    const options = [];
    for (let i = 0; i < dropdownKeys.length; i++) {
      options.push({ value: dropdownKeys[i]});
    }
    return options;
  };

  const sectionDropDown = createDropDownValues(sectionInfo);
  const navInfoDropDown = createDropDownValues(navInfo);

  return (
    <div className ='ally-nav-area' style={ barStyle }>
        <div className = 'dropdown' style={ dropDownStyle }> 
          <label htmlFor='component-dropdown' tabIndex='-1' ref={accessBarRef} > Jump to section: </label>
          <div id='component-dropdown' >
            <Dropdown
              options={ sectionDropDown }
              style={ activeComponentDDStyle }
              placeholder='Sections of this page'
              ariaLabel='Navigation Assistant'
              setSelected={setFocus} 
            />
          </div>
        </div>
          <div className = 'dropdown' style={ dropDownStyle }> 
          <label htmlFor='page-dropdown'> Jump to page: </label>
          <div id='page-dropdown' >
            <Dropdown
              options={ navInfoDropDown }
              style={ activeComponentDDStyle }
              placeholder='Other pages on this site'
              ariaLabel='Navigation Assistant'
              setSelected={ changeView } 
            />
          </div>
        </div>
      </div>
  );
};

/** Style for entire AccessBar */
const barStyle =  {
  display: 'flex',
  paddingTop: '.1em',
  paddingBottom: '.1em',
  paddingLeft: '5em',
  alignItems: 'center',
  justifyContent: 'flex-start',
  zIndex: '100',
  position: 'sticky',
  top: '0',
  width: '100%',
  fontSize: '.8em',
  backgroundColor: 'lightblue',
  fontFamily: 'montserrat',
  color: '#373D3F'
};

const dropDownStyle = {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '1em',
};

/** Style for Dropdown component **/
const activeComponentDDStyle = {
  DropdownButton: base => ({
    ...base,
    margin: '5px',
    border: '1px solid',
    fontSize: '.5em',
  }),
  OptionContainer: base => ({
    ...base,
    margin: '5px',
    fontSize: '.5em',
  }),
};

/** Style for hiddenH1 */
const hiddenH1Styles = {
  display: 'block',
  overflow: 'hidden',
  textIndent: '100%',
  whiteSpace: 'nowrap',
  fontSize: '0.01px',
};

export default AccessBarWithRouter;