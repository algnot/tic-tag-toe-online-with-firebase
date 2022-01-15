import React, {useState} from 'react'
import { firestore } from '../../firebase'

export default function JoinRoom({close}) {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const joinRoom = () => {
        const roomRef = firestore.collection('ticTac').doc(code)
        roomRef.get()
        .then(doc => {
            if(doc.exists){
                window.location.href = `./?page=game&room=${code}`
            } else {
                setError('ไม่พบห้องดังกล่าว')
            }
        })
    }

    return (
        <div className='name-container'>
            <div className='name-form'>
                <div className='name-form-header'>ใส่โค้ดห้อง</div>
                <input value={code}
                       type="number"
                       name="code"
                       placeholder='ใส่โค้ดห้อง..'
                       onChange={(e) => setCode(e.target.value)} />
                <div className='name-error'>{error}</div>
                <div className='home-btn'
                     onClick={joinRoom}>เข้าร่วม</div>
                <div className='home-btn'
                     onClick={close}>กลับหน้าหลัก</div>
            </div>
        </div>
    )
}
