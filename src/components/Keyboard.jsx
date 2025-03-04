import { useState } from 'react'
import NewKey from './ClickableDiv'

function Keyboard(props){

    const [keys, setKeys] = useState(Array(24).fill(null));
    
    return (
        <div className='tkb-piano-container'>
            {
                keys.map((el, index) =>
                    <NewKey key={index} index={index} keyClass={index < 10 ? "tkb-black-key" : "tkb-white-key"}/>
                )
            }
        </div>
    );
}
export default Keyboard