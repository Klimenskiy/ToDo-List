import imgLight from '../../img/illustrations/img2.png';
import imgDark from '../../img/illustrations/img1.png';

import './empty.scss';

const Empty = (props) => {
    return ( 
        <div className="empty">
            <div className="empty__preview">
                {props.scheme ? (<img src={imgDark} alt="" className="empty__preview-img" />) : (<img src={imgLight} alt="" className="empty__preview-img" />)}
            </div>
            <p className="empty__message">Oops... it's empty :( </p>
        </div>
     );
}
 
export default Empty;
