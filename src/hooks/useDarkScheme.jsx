import React from 'react';

const useDarkScheme = () => {
    const [darkScheme, setDarkScheme] = React.useState(localStorage.getItem('darkScheme') ? localStorage.getItem('darkScheme') : window.matchMedia('(prefers-color-scheme: dark)').matches);

    const checkScheme = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)  {
        setDarkScheme(true);
      } else {
        setDarkScheme(false);
      }
    }
    
    React.useEffect(() => {
      const cachedDarkScheme = localStorage.getItem('darkScheme');
    
      if (darkScheme === true || darkScheme === 'true') {
        setDarkScheme(true);
      } else if (darkScheme === false || darkScheme === 'false') {
        setDarkScheme(false);
      } else {
        if (cachedDarkScheme !== null) {
          setDarkScheme(false);
        } else {
          checkScheme(cachedDarkScheme);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    React.useEffect(() => {
      localStorage.setItem('darkScheme', darkScheme);
    }, [darkScheme]);
    
    const changeScheme = () => {
      setDarkScheme(!darkScheme);
    }

    return { darkScheme, changeScheme };
}

export default useDarkScheme;
